import { TlFieldModel } from "../models/field.js";
import type { TlField } from "../models/field.js";

export function parseTlField(value: unknown): TlField {
    return TlFieldModel.parse(value);
}
