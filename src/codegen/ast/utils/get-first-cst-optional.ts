import type { CstNode } from "chevrotain";

export function getFirstCstOptional(nodes: CstNode[]): CstNode | undefined {
    return nodes[0];
}
