import { DocCommentModel } from "../models/doc-comment.js";
import type { DocComment } from "../models/doc-comment.js";

export function parseDocComment(value: unknown): DocComment {
    return DocCommentModel.parse(value);
}
