import { TlTypeModel } from "../models/type.js";
import type { TlType } from "../models/type.js";

export function parseTlType(value: unknown): TlType {
    return TlTypeModel.parse(value);
}
