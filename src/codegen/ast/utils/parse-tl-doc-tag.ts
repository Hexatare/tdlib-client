import { TlDocTagModel } from "../models/doc-tag.js";
import type { TlDocTag } from "../models/doc-tag.js";

export function parseTlDocTag(value: unknown): TlDocTag {
    return TlDocTagModel.parse(value);
}
