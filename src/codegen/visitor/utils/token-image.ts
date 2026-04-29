import type { IToken } from "chevrotain";

export function tokenImage(token: IToken | undefined): string {
    return token?.image ?? "";
}
