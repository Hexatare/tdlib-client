import type { CstElement, IToken } from "chevrotain";

export function isToken(element: CstElement): element is IToken {
    return "image" in element;
}
