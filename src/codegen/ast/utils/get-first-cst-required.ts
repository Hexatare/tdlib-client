import type { CstNode } from "chevrotain";

export function getFirstCstRequired(nodes: CstNode[]): CstNode {
    const node = nodes[0];

    if (!node) {
        throw new Error("Expected CST node");
    }

    return node;
}
