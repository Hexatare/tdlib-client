import type { TlDocTag } from "../models/doc-tag.js";
import type { TlField } from "../models/field.js";

export function findFieldDocTag(docTags: TlDocTag[], field: TlField): TlDocTag | undefined {
    const exactTag = docTags.find((docTag) => docTag.tag === field.name);

    if (exactTag) {
        return exactTag;
    }

    const escapedTagName = `param_${field.name}`;
    const escapedTag = docTags.find((docTag) => docTag.tag === escapedTagName);

    return escapedTag;
}
