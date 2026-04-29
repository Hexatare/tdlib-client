import { capitalizeFirstLetter } from "./capitalize-first-letter.js";
import type { TlType } from "../../visitor/models/type.js";

export function generateTranslatedType(parsedType: TlType): string {
    if (parsedType.kind === "name") {
        switch (parsedType.name) {
            case "double":
                return "number";
            case "string":
                return "string";
            case "int32":
                return "number";
            case "int53":
                return "number";
            case "int64":
                return "bigint";
            case "bytes":
                return "Uint8Array";
            case "Bool":
                return "boolean";
            default:
                return capitalizeFirstLetter(parsedType.name);
        }
    }

    if (parsedType.name !== "vector") {
        throw new Error(`Received invalid generic: ${parsedType.name}`);
    }

    return `Array<${generateTranslatedType(parsedType.argument)}>`;
}
