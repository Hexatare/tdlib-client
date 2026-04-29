import type { CstNode, IToken } from "chevrotain";

export type CstChildren = Record<string, CstNode[] | IToken[] | undefined>;
