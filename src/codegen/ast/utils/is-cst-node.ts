import type { CstElement, CstNode } from "chevrotain";

export function isCstNode(element: CstElement): element is CstNode {
    return "children" in element;
}
