import { createToken, Lexer } from "chevrotain";

export const DocTagCommentStartToken = createToken({
    name: "DocTagCommentStart",
    pattern: /\/\/(?=@[A-Za-z_][A-Za-z0-9_]*)/,
    group: Lexer.SKIPPED,
    push_mode: "docTagComment",
});

export const DocTagCommentToken = createToken({
    name: "DocTagComment",
    pattern: /@[A-Za-z_][A-Za-z0-9_]*/,
});

export const DocTextCommentToken = createToken({
    name: "DocTextComment",
    pattern: /[^\r\n]+/,
    pop_mode: true,
});

export const DocTagCommentWhitespaceToken = createToken({
    name: "DocTagCommentWhitespace",
    pattern: /[ \t]+/,
    group: Lexer.SKIPPED,
});

export const DocTagCommentLineBreakToken = createToken({
    name: "DocTagCommentLineBreak",
    pattern: /\r?\n/,
    group: Lexer.SKIPPED,
    line_breaks: true,
    pop_mode: true,
});

export const DocContinuationCommentToken = createToken({
    name: "DocContinuationComment",
    pattern: /\/\/-[^\r\n]*/,
});

export const LineCommentToken = createToken({
    name: "LineComment",
    pattern: /\/\/[^\r\n]*/,
    group: Lexer.SKIPPED,
});
