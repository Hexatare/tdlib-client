import { TlClassModel } from "../models/class.js";
import type { TlClass } from "../models/class.js";

export function isClass(item: unknown): item is TlClass {
    return TlClassModel.safeParse(item).success;
}
