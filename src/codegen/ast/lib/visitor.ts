import { BaseTlVisitor } from "./base-tl-visitor.js";
import { cstNodes } from "../utils/cst-nodes.js";
import { findFieldDocTag } from "../utils/find-field-doc-tag.js";
import { getFirstCstOptional } from "../utils/get-first-cst-optional.js";
import { getFirstCstRequired } from "../utils/get-first-cst-required.js";
import { isClass } from "../utils/is-class.js";
import { isDeclaration } from "../utils/is-declaration.js";
import { joinCommentText } from "../utils/join-comment-text.js";
import { parseDeclarationSection } from "../utils/parse-declaration-section.js";
import { parseDocComment } from "../utils/parse-doc-comment.js";
import { parseStringArray } from "../utils/parse-string-array.js";
import { parseTlClass } from "../utils/parse-tl-class.js";
import { parseTlDeclaration } from "../utils/parse-tl-declaration.js";
import { parseTlDocTag } from "../utils/parse-tl-doc-tag.js";
import { parseTlField } from "../utils/parse-tl-field.js";
import { parseTlSchema } from "../utils/parse-tl-schema.js";
import { parseTlType } from "../utils/parse-tl-type.js";
import { stripTagPrefix } from "../utils/strip-tag-prefix.js";
import { tokenImage } from "../utils/token-image.js";
import { tokenNodes } from "../utils/token-nodes.js";
import { emptyDeclarationSection } from "../config/empty-declaration-section.js";
import type { TlClass } from "../models/class.js";
import type { TlDeclaration } from "../models/declaration.js";
import type { TlDocTag } from "../models/doc-tag.js";
import type { TlField } from "../models/field.js";
import type { TlSchema } from "../models/schema.js";
import type { TlType } from "../models/type.js";
import type { CstChildren } from "../types/cst-children.js";
import type { DeclarationSection } from "../models/declaration-section.js";
import type { DocComment } from "../models/doc-comment.js";

export class TlAstVisitor extends BaseTlVisitor {
    public constructor() {
        super();
        this.validateVisitor();
    }

    /**
     * Converts the root schema CST into `TlSchema`.
     *
     * `TlSchema` is the full AST used by code generation. It contains class metadata,
     * constructor/type declarations, and function declarations in separate arrays.
     */
    public schema(ctx: CstChildren): TlSchema {
        const typeDefinitionNodes = cstNodes(ctx, "typeDefinitions");
        const functionDefinitionNodes = cstNodes(ctx, "functionDefinitions");

        const typeDefinitionNode = getFirstCstRequired(typeDefinitionNodes);
        const functionDefinitionNode = getFirstCstOptional(functionDefinitionNodes);

        /* Visit the nodes and parse the result */

        const visitedTypeSection = this.visit(typeDefinitionNode);

        const visitedFunctionSection = functionDefinitionNode
            ? this.visit(functionDefinitionNode)
            : emptyDeclarationSection;

        const typeSection = parseDeclarationSection(visitedTypeSection);
        const functionSection = parseDeclarationSection(visitedFunctionSection);

        /* Create the final schema */

        const finalSchema = {
            classes: [...typeSection.classes, ...functionSection.classes],
            types: typeSection.declarations.map((declaration) => ({
                ...declaration,
                kind: "type",
            })),
            functions: functionSection.declarations.map((declaration) => ({
                ...declaration,
                kind: "function",
            })),
        };

        const parsedSchema = parseTlSchema(finalSchema);
        return parsedSchema;
    }

    /**
     * Converts the constructors section before `---functions---` into a declaration section.
     *
     * A declaration section is an internal grouping with two arrays: `classes` for
     * `@class` metadata comments and `declarations` for constructor declarations.
     */
    public typeDefinitions(ctx: CstChildren): DeclarationSection {
        return this.collectDeclarationSection(ctx);
    }

    /**
     * Converts the functions section after `---functions---` into a declaration section.
     */
    public functionDefinitions(ctx: CstChildren): DeclarationSection {
        return this.collectDeclarationSection(ctx);
    }

    /**
     * Converts one top-level schema item into either class metadata or a documented declaration.
     *
     * Class metadata becomes `TlClass`. A documented constructor/function becomes
     * `TlDeclaration`, including its description, fields, result type, and doc tags.
     */
    public schemaItem(ctx: CstChildren): TlClass | TlDeclaration {
        const classCommentNodes = cstNodes(ctx, "classComment");
        const declarationWithDocsNodes = cstNodes(ctx, "declarationWithDocs");

        const classCommentNode = getFirstCstOptional(classCommentNodes);
        const declarationWithDocsNode = getFirstCstOptional(declarationWithDocsNodes);

        /* Check which node exists and return it */

        if (classCommentNode) {
            const visitedClassComment = this.visit(classCommentNode);
            const tlClass = parseTlClass(visitedClassComment);

            return tlClass;
        }

        if (declarationWithDocsNode) {
            const visitedDeclaration = this.visit(declarationWithDocsNode);
            const declaration = parseTlDeclaration(visitedDeclaration);

            return declaration;
        }

        throw new Error("Expected either a 'classComment' or a 'declarationWithDocs' node.");
    }

    /**
     * Converts a `@class ... @description ...` comment into class metadata.
     *
     * The returned `TlClass` describes a result type group, such as `AuthorizationState`,
     * and stores the class name plus its documentation text.
     */
    public classComment(ctx: CstChildren): TlClass {
        /* Get the name of the class and the description */

        const classNameTokens = tokenNodes(ctx, "className");
        const descriptionTokens = tokenNodes(ctx, "description");

        const classNameToken = classNameTokens[0];
        const descriptionToken = descriptionTokens[0];

        const classNameText = tokenImage(classNameToken);
        const descriptionText = tokenImage(descriptionToken);

        /* Merge the description with any additional doc lines */

        const docContinuationNodes = cstNodes(ctx, "docContinuations");
        const docContinuationNode = getFirstCstOptional(docContinuationNodes);

        let description = descriptionText;

        if (docContinuationNode) {
            const visitedDocContinuations = this.visit(docContinuationNode);
            const docContinuations = parseStringArray(visitedDocContinuations);

            description = joinCommentText(descriptionText, docContinuations);
        }

        const tlClass = {
            name: classNameText.trim(),
            description,
        };

        const parsedTlClass = parseTlClass(tlClass);
        return parsedTlClass;
    }

    /**
     * Combines a declaration with its required description and field documentation.
     *
     * The returned `TlDeclaration` is the codegen-ready declaration object. It merges
     * the raw TL declaration with the leading `@description`, attaches all extra doc tags,
     * and copies matching field doc text into each `TlField.description`.
     */
    public declarationWithDocs(ctx: CstChildren): TlDeclaration {
        const descriptionCommentNodes = cstNodes(ctx, "descriptionComment");
        const declarationNodes = cstNodes(ctx, "declaration");

        const descriptionCommentNode = getFirstCstRequired(descriptionCommentNodes);
        const declarationNode = getFirstCstRequired(declarationNodes);

        /* Visit the nodes and parse the data */

        const visitedDescriptionComment = this.visit(descriptionCommentNode);
        const visitedDeclaration = this.visit(declarationNode);

        const descriptionComment = parseDocComment(visitedDescriptionComment);
        const declaration = parseTlDeclaration(visitedDeclaration);

        /* Loop over all the doc comment nodes */

        const fieldDocCommentNodes = cstNodes(ctx, "fieldDocComment");

        const docTags = fieldDocCommentNodes.map((fieldDocCommentNode) => {
            const visitedFieldDocComment = this.visit(fieldDocCommentNode);
            const docTag = parseTlDocTag(visitedFieldDocComment);

            return docTag;
        });

        /* Loop over all the fields of the declaration */

        const fields = declaration.fields.map((field) => {
            const fieldDoc = findFieldDocTag(docTags, field);

            if (!fieldDoc) {
                throw new Error(`Could not find the doc string for the field: ${field.name}`);
            }

            const describedField = {
                ...field,
                description: fieldDoc.text,
            };

            const parsedDescribedField = parseTlField(describedField);
            return parsedDescribedField;
        });

        const declarationWithDocs = {
            ...declaration,
            description: descriptionComment.description,
            docTags,
            fields,
        };

        const parsedDeclarationWithDocs = parseTlDeclaration(declarationWithDocs);
        return parsedDeclarationWithDocs;
    }

    /**
     * Converts a required `@description` comment and its continuations into a doc comment.
     *
     * `DocComment` is an internal object with only `description`; it exists so the
     * declaration-level description can be validated before it is merged into `TlDeclaration`.
     */
    public descriptionComment(ctx: CstChildren): DocComment {
        const docTextCommentTokens = tokenNodes(ctx, "DocTextComment");
        const docTextCommentToken = docTextCommentTokens[0];

        const descriptionText = tokenImage(docTextCommentToken);

        /* Merge the description with any additional doc lines */

        const docContinuationNodes = cstNodes(ctx, "docContinuations");
        const docContinuationNode = getFirstCstOptional(docContinuationNodes);

        let description = descriptionText;

        if (docContinuationNode) {
            const visitedDocContinuations = this.visit(docContinuationNode);
            const docContinuations = parseStringArray(visitedDocContinuations);

            description = joinCommentText(descriptionText, docContinuations);
        }

        const docComment = {
            description,
        };

        const parsedDocComment = parseDocComment(docComment);
        return parsedDocComment;
    }

    /**
     * Converts a field documentation tag and its continuations into a doc tag.
     *
     * The returned `TlDocTag` stores the tag name without `@` and the full text for that
     * tag. For example, `@message Error message` becomes `{ tag: "message", text: "Error message" }`.
     */
    public fieldDocComment(ctx: CstChildren): TlDocTag {
        const docTagCommentTokens = tokenNodes(ctx, "DocTagComment");
        const docTextCommentTokens = tokenNodes(ctx, "DocTextComment");

        const docTagCommentToken = docTagCommentTokens[0];
        const docTextCommentToken = docTextCommentTokens[0];

        const docTagCommentText = tokenImage(docTagCommentToken);
        const docTextCommentText = tokenImage(docTextCommentToken);

        /* Merge the text with any additional doc lines */

        const docContinuationNodes = cstNodes(ctx, "docContinuations");
        const docContinuationNode = getFirstCstOptional(docContinuationNodes);

        let text = docTextCommentText;

        if (docContinuationNode) {
            const visitedDocContinuations = this.visit(docContinuationNode);
            const docContinuations = parseStringArray(visitedDocContinuations);

            text = joinCommentText(docTextCommentText, docContinuations);
        }

        const docTag = {
            tag: stripTagPrefix(docTagCommentText),
            text,
        };

        const parsedDocTag = parseTlDocTag(docTag);
        return parsedDocTag;
    }

    /**
     * Converts `//-` continuation comment tokens into trimmed text lines.
     *
     * These strings are appended to the previous class, description, or field doc text.
     */
    public docContinuations(ctx: CstChildren): string[] {
        const docContinuationCommentTokens = tokenNodes(ctx, "DocContinuationComment");

        const docContinuations = docContinuationCommentTokens.map((token) => {
            const textWithoutPrefix = token.image.replace(/^\/\/-/, "");
            const text = textWithoutPrefix.trim();

            return text;
        });

        const parsedDocContinuations = parseStringArray(docContinuations);
        return parsedDocContinuations;
    }

    /**
     * Converts a raw TL declaration into a declaration AST node without attached docs.
     *
     * This creates the structural part of `TlDeclaration`: declaration name, fields,
     * result type, and empty documentation placeholders. `declarationWithDocs` fills in
     * the description and doc tags afterward.
     */
    public declaration(ctx: CstChildren): TlDeclaration {
        /* Get the name of the declaration */

        const nameTokens = tokenNodes(ctx, "name");
        const nameToken = nameTokens[0];

        const name = tokenImage(nameToken);

        /* Get the fields of the declaration */

        const fieldNodes = cstNodes(ctx, "field");

        const fields = fieldNodes.map((fieldNode) => {
            const visitedField = this.visit(fieldNode);
            const field = parseTlField(visitedField);

            return field;
        });

        /* Get the result type from the CST node */

        const resultTypeNodes = cstNodes(ctx, "resultType");
        const resultTypeNode = getFirstCstRequired(resultTypeNodes);

        const visitedResultType = this.visit(resultTypeNode);
        const resultType = parseTlType(visitedResultType);

        /* Create the final declaration object */

        const declaration = {
            kind: "type",
            name,
            description: "",
            fields,
            resultType,
            docTags: [],
        };

        const parsedDeclaration = parseTlDeclaration(declaration);
        return parsedDeclaration;
    }

    /**
     * Converts one declaration field into a field AST node.
     *
     * The returned `TlField` contains the field name and parsed TL type. Its description
     * starts empty here and is filled from matching field doc tags later.
     */
    public field(ctx: CstChildren): TlField {
        /* Get the name of the fueld */

        const nameTokens = tokenNodes(ctx, "name");
        const nameToken = nameTokens[0];

        const name = tokenImage(nameToken);

        /* The the field type from the CST node */

        const fieldTypeNodes = cstNodes(ctx, "fieldType");
        const fieldTypeNode = getFirstCstRequired(fieldTypeNodes);

        const visitedFieldType = this.visit(fieldTypeNode);
        const type = parseTlType(visitedFieldType);

        /* Create the final field object */

        const field = {
            name,
            description: "",
            type,
        };

        const parsedField = parseTlField(field);
        return parsedField;
    }

    /**
     * Converts a type expression into either a named type or generic type AST node.
     *
     * A named type is a plain reference such as `string` or `Message`. A generic type is
     * a wrapper such as `vector<Message>` with the argument stored as another `TlType`.
     */
    public typeExpression(ctx: CstChildren): TlType {
        /* Get the name of the type expression */

        const nameTokens = tokenNodes(ctx, "name");
        const nameToken = nameTokens[0];

        const name = tokenImage(nameToken);

        /* Check if the type expression contains nested arguments */

        const typeArgumentNodes = cstNodes(ctx, "typeArgument");
        const typeArgumentNode = getFirstCstOptional(typeArgumentNodes);

        if (!typeArgumentNode) {
            const nameType = {
                kind: "name",
                name,
            };

            const parsedNameType = parseTlType(nameType);
            return parsedNameType;
        }

        /* If yes, parse the recursively and add them to the final object */

        const visitedTypeArgument = this.visit(typeArgumentNode);
        const argument = parseTlType(visitedTypeArgument);

        const genericType = {
            kind: "generic",
            name,
            argument,
        };

        const parsedGenericType = parseTlType(genericType);
        return parsedGenericType;
    }

    /**
     * Collects visited schema items into separate class metadata and declaration arrays.
     *
     * The returned `DeclarationSection` is an internal grouping used while walking either
     * the constructors section or the functions section. It keeps `TlClass` metadata apart
     * from `TlDeclaration` objects so `schema` can assemble the final `TlSchema`.
     */
    private collectDeclarationSection(ctx: CstChildren): DeclarationSection {
        const schemaItemNodes = cstNodes(ctx, "schemaItem");

        const items = schemaItemNodes.map((schemaItemNode) => {
            const visitedSchemaItem = this.visit(schemaItemNode);

            if (isClass(visitedSchemaItem)) {
                const declaration = parseTlClass(visitedSchemaItem);
                return declaration;
            }

            const declaration = parseTlDeclaration(visitedSchemaItem);
            return declaration;
        });

        /* Create the final declaration section object */

        const declarationSection = {
            classes: items.filter(isClass),
            declarations: items.filter(isDeclaration),
        };

        const parsedDeclarationSection = parseDeclarationSection(declarationSection);
        return parsedDeclarationSection;
    }
}
