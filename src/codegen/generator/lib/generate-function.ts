import { generateJsDocComment } from "../utils/generate-js-doc-comment.js";
import { generateTranslatedType } from "../utils/generate-translated-type.js";
import { capitalizeFirstLetter } from "../utils/capitalize-first-letter.js";
import type { TlFunctionDeclaration } from "../../visitor/models/declaration.js";

export function generateFunction(parsedFunctionDeclaration: TlFunctionDeclaration): string {
    if (parsedFunctionDeclaration.fields.length === 0) {
        return [
            generateJsDocComment(parsedFunctionDeclaration.description),
            `export async function ${parsedFunctionDeclaration.name}(): Promise<${generateTranslatedType(parsedFunctionDeclaration.resultType)}> {}`,
        ].join("\n");
    }

    return [
        generateJsDocComment(`Input type for the ${parsedFunctionDeclaration.name} function.`),
        `export type ${capitalizeFirstLetter(parsedFunctionDeclaration.name)}Input = {`,
        ...parsedFunctionDeclaration.fields.flatMap((field) => [
            `    ${generateJsDocComment(field.description, true)}`,
            `    ${field.name}: ${generateTranslatedType(field.type)};`,
        ]),
        "}",
        "",
        generateJsDocComment(parsedFunctionDeclaration.description),
        `export async function ${parsedFunctionDeclaration.name}(input: ${capitalizeFirstLetter(parsedFunctionDeclaration.name)}Input): Promise<${generateTranslatedType(parsedFunctionDeclaration.resultType)}> {}`,
    ].join("\n");
}
