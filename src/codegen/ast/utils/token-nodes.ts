import type { IToken } from "chevrotain";
import type { CstChildren } from "../types/cst-children.js";

export function tokenNodes(ctx: CstChildren, key: string): IToken[] {
    return (ctx[key] ?? []) as IToken[];
}
