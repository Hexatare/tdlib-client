import { createToken, Lexer } from "chevrotain";

export const WhiteSpaceToken = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
    line_breaks: true,
});
