import { isToken } from "./is-token.js";
import type { IToken } from "chevrotain";
import type { CstChildrenDictionary } from "chevrotain";

export function tokenNodes(ctx: CstChildrenDictionary, key: string): IToken[] {
    const children = ctx[key] ?? [];
    const tokens = children.filter(isToken);

    return tokens;
}
