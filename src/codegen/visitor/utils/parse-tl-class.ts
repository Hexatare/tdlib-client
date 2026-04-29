import { TlClassModel } from "../models/class.js";
import type { TlClass } from "../models/class.js";

export function parseTlClass(value: unknown): TlClass {
    return TlClassModel.parse(value);
}
