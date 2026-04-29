import { isCstNode } from "./is-cst-node.js";
import type { CstNode } from "chevrotain";
import type { CstChildrenDictionary } from "chevrotain";

export function cstNodes(ctx: CstChildrenDictionary, key: string): CstNode[] {
    const children = ctx[key] ?? [];
    const nodes = children.filter(isCstNode);

    return nodes;
}
