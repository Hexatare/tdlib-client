import { generateJsDocComment } from "../utils/generate-js-doc-comment.js";
import { generateTranslatedType } from "../utils/generate-translated-type.js";
import { capitalizeFirstLetter } from "../utils/capitalize-first-letter.js";
import type { TlTypeDeclaration } from "../../visitor/models/declaration.js";

export function generateType(
    parsedTypeDeclaration: TlTypeDeclaration,
    unionTypeToConstituentsMap: Map<string, string[]>,
): string {
    if (parsedTypeDeclaration.resultType.kind === "name") {
        /* Store the type so the union types can later be created */

        const existingUnionTypeEntry = unionTypeToConstituentsMap.get(
            parsedTypeDeclaration.resultType.name,
        );

        if (existingUnionTypeEntry) {
            unionTypeToConstituentsMap.set(parsedTypeDeclaration.resultType.name, [
                ...existingUnionTypeEntry,
                parsedTypeDeclaration.name,
            ]);
        } else {
            unionTypeToConstituentsMap.set(parsedTypeDeclaration.resultType.name, [
                parsedTypeDeclaration.name,
            ]);
        }
    }

    return [
        generateJsDocComment(parsedTypeDeclaration.description),
        `export type ${capitalizeFirstLetter(parsedTypeDeclaration.name)} = {`,
        ...parsedTypeDeclaration.fields.flatMap((field) => [
            `    ${generateJsDocComment(field.description, true)}`,
            `    ${field.name}: ${generateTranslatedType(field.type)};`,
        ]),
        "}",
    ].join("\n");
}
