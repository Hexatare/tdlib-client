import { generateType } from "./lib/generate-type.js";
import { generateUnion } from "./lib/generate-union.js";
import { generateFunction } from "./lib/generate-function.js";
import type { TlSchema } from "../visitor/models/schema.js";

export type GeneratedTypescriptOutput = {
    generatedTypes: string[];
    generatedFunctions: string[];
    generatedUnions: string[];
};

export function generateTypescriptOutput(parsedSchema: TlSchema): GeneratedTypescriptOutput {
    const { types, classes, functions } = parsedSchema;

    const unionTypeToConstituentsMap = new Map<string, string[]>();

    return {
        generatedTypes: types.map((item) => generateType(item, unionTypeToConstituentsMap)),
        generatedUnions: classes.map((item) => generateUnion(item, unionTypeToConstituentsMap)),
        generatedFunctions: functions.map(generateFunction),
    };
}
