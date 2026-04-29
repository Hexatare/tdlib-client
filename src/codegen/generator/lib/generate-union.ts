import { generateJsDocComment } from "../utils/generate-js-doc-comment.js";
import { capitalizeFirstLetter } from "../utils/capitalize-first-letter.js";
import type { TlClass } from "../../visitor/models/class.js";

export function generateUnion(
    parsedClass: TlClass,
    unionTypeToConstituentsMap: Map<string, string[]>,
) {
    const constituentsForClass = unionTypeToConstituentsMap.get(parsedClass.name);

    if (!constituentsForClass) {
        throw new Error("Found union type with no constituents");
    }

    return [
        generateJsDocComment(parsedClass.description),
        `export type ${parsedClass.name} = ${constituentsForClass.map(capitalizeFirstLetter).join(" | ")};`,
    ].join("\n");
}
