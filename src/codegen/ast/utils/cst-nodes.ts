import type { CstNode } from "chevrotain";
import type { CstChildren } from "../types/cst-children.js";

export function cstNodes(ctx: CstChildren, key: string): CstNode[] {
    return (ctx[key] ?? []) as CstNode[];
}
