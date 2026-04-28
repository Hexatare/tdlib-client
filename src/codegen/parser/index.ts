import { CstParser } from "chevrotain";
import { allTlTokens } from "../lexer/index.js";

import {
    DocClassTagToken,
    DocContinuationCommentToken,
    DocDescriptionTagToken,
    DocTagCommentToken,
    DocTextCommentToken,
} from "../lexer/tokens/comment.js";
import { FunctionSectionMarkerToken } from "../lexer/tokens/function-section-marker.js";
import {
    ColonToken,
    EqualsToken,
    GreaterThanToken,
    IdentifierToken,
    LessThanToken,
    SemicolonToken,
} from "../lexer/tokens/declarations.js";

export class TlParser extends CstParser {
    /**
     * Parses a complete TL schema, including type definitions and optional function definitions.
     *
     * Example: `error code:int32 = Error; ---functions--- getOption name:string = OptionValue;`
     */
    public readonly schema = this.RULE("schema", () => {
        this.SUBRULE(this.typeDefinitions);
        this.OPTION(() => {
            this.CONSUME(FunctionSectionMarkerToken);
            this.SUBRULE(this.functionDefinitions);
        });
    });

    /**
     * Parses the type/constructor declarations before the functions section marker.
     *
     * Example: `error code:int32 message:string = Error;`
     */
    private readonly typeDefinitions = this.RULE("typeDefinitions", () => {
        this.MANY(() => {
            this.SUBRULE(this.schemaItem);
        });
    });

    /**
     * Parses the function declarations after the functions section marker.
     *
     * Example: `getOption name:string = OptionValue;`
     */
    private readonly functionDefinitions = this.RULE("functionDefinitions", () => {
        this.MANY(() => {
            this.SUBRULE(this.schemaItem);
        });
    });

    /**
     * Parses one top-level schema item, either a documentation comment or a declaration.
     *
     * Example: `//@class Error @description Error type` or `//@description Error details`
     */
    private readonly schemaItem = this.RULE("schemaItem", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.classComment) },
            { ALT: () => this.SUBRULE(this.declarationWithDocs) },
        ]);
    });

    /**
     * Parses a class documentation comment, which must include a same-line description.
     * Continuation lines belong to the class description.
     *
     * Example: `//@class Error @description Describes an error object` followed by `//-More details`
     */
    private readonly classComment = this.RULE("classComment", () => {
        this.CONSUME(DocClassTagToken);
        this.CONSUME(DocTextCommentToken, { LABEL: "className" });
        this.CONSUME(DocDescriptionTagToken);
        this.CONSUME2(DocTextCommentToken, { LABEL: "description" });
        this.SUBRULE(this.docContinuations);
    });

    /**
     * Parses a declaration together with its required leading description and optional extra docs.
     *
     * Example: `//@description Error details error code:int32 = Error;`
     */
    private readonly declarationWithDocs = this.RULE("declarationWithDocs", () => {
        this.SUBRULE(this.descriptionComment);
        this.MANY(() => {
            this.SUBRULE(this.fieldDocComment);
        });
        this.SUBRULE(this.declaration);
    });

    /**
     * Parses the required description documentation for a declaration.
     * Continuation lines belong to this description.
     *
     * Example: `//@description Error details` followed by `//-More details`
     */
    private readonly descriptionComment = this.RULE("descriptionComment", () => {
        this.CONSUME(DocDescriptionTagToken);
        this.CONSUME(DocTextCommentToken);
        this.SUBRULE(this.docContinuations);
    });

    /**
     * Parses a non-description documentation tag for a declaration field or metadata.
     * Continuation lines belong to this tag.
     *
     * Example: `//@code Error code` followed by `//-More details`
     */
    private readonly fieldDocComment = this.RULE("fieldDocComment", () => {
        this.CONSUME(DocTagCommentToken);
        this.CONSUME(DocTextCommentToken);
        this.SUBRULE(this.docContinuations);
    });

    /**
     * Parses zero or more continuation comment lines for the preceding documentation tag.
     *
     * Example: `//-More details`
     */
    private readonly docContinuations = this.RULE("docContinuations", () => {
        this.MANY(() => {
            this.CONSUME(DocContinuationCommentToken);
        });
    });

    /**
     * Parses a TL declaration with a name, optional fields, result type, and semicolon.
     *
     * Example: `error code:int32 message:string = Error;`
     */
    private readonly declaration = this.RULE("declaration", () => {
        this.CONSUME(IdentifierToken, { LABEL: "name" });
        this.MANY(() => {
            this.SUBRULE(this.field);
        });
        this.CONSUME(EqualsToken);
        this.SUBRULE(this.typeExpression, { LABEL: "resultType" });
        this.CONSUME(SemicolonToken);
    });

    /**
     * Parses one named field in a declaration.
     *
     * Example: `message:string`
     */
    private readonly field = this.RULE("field", () => {
        this.CONSUME(IdentifierToken, { LABEL: "name" });
        this.CONSUME(ColonToken);
        this.SUBRULE(this.typeExpression, { LABEL: "fieldType" });
    });

    /**
     * Parses a type name, optionally with one generic type argument.
     *
     * Example: `string` or `vector<int32>`
     */
    private readonly typeExpression = this.RULE("typeExpression", () => {
        this.CONSUME(IdentifierToken, { LABEL: "name" });
        this.OPTION(() => {
            this.CONSUME(LessThanToken);
            this.SUBRULE(this.typeExpression, { LABEL: "typeArgument" });
            this.CONSUME(GreaterThanToken);
        });
    });

    public constructor() {
        super(allTlTokens);
        this.performSelfAnalysis();
    }
}
