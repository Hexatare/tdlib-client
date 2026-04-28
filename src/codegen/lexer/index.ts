import { Lexer } from "chevrotain";
import {
    BuiltinDoubleDefinitionToken,
    BuiltinStringDefinitionToken,
    BuiltinInt32DefinitionToken,
    BuiltinInt53DefinitionToken,
    BuiltinInt64DefinitionToken,
    BuiltinBytesDefinitionToken,
    BuiltinBoolFalseDefinitionToken,
    BuiltinBoolTrueDefinitionToken,
    BuiltinVectorDefinitionToken,
} from "./tokens/builtin-definition.js";
import {
    DocTagCommentStartToken,
    DocTagCommentToken,
    DocTextCommentToken,
    DocTagCommentWhitespaceToken,
    DocTagCommentLineBreakToken,
    DocContinuationCommentToken,
    LineCommentToken,
} from "./tokens/comment.js";
import { FunctionSectionMarkerToken } from "./tokens/function-section-marker.js";
import { WhiteSpaceToken } from "./tokens/white-space.js";
import {
    LessThanToken,
    GreaterThanToken,
    ColonToken,
    EqualsToken,
    SemicolonToken,
    IdentifierToken,
} from "./tokens/declarations.js";
import type { TokenType } from "chevrotain";

export const allTlTokens: TokenType[] = [
    BuiltinDoubleDefinitionToken,
    BuiltinStringDefinitionToken,
    BuiltinInt32DefinitionToken,
    BuiltinInt53DefinitionToken,
    BuiltinInt64DefinitionToken,
    BuiltinBytesDefinitionToken,
    BuiltinBoolFalseDefinitionToken,
    BuiltinBoolTrueDefinitionToken,
    BuiltinVectorDefinitionToken,
    DocTagCommentStartToken,
    DocTagCommentToken,
    DocTextCommentToken,
    DocTagCommentWhitespaceToken,
    DocTagCommentLineBreakToken,
    DocContinuationCommentToken,
    LineCommentToken,
    FunctionSectionMarkerToken,
    WhiteSpaceToken,
    LessThanToken,
    GreaterThanToken,
    ColonToken,
    EqualsToken,
    SemicolonToken,
    IdentifierToken,
];

export const TlLexer = new Lexer({
    modes: {
        defaultMode: [
            BuiltinDoubleDefinitionToken,
            BuiltinStringDefinitionToken,
            BuiltinInt32DefinitionToken,
            BuiltinInt53DefinitionToken,
            BuiltinInt64DefinitionToken,
            BuiltinBytesDefinitionToken,
            BuiltinBoolFalseDefinitionToken,
            BuiltinBoolTrueDefinitionToken,
            BuiltinVectorDefinitionToken,
            DocTagCommentStartToken,
            DocContinuationCommentToken,
            LineCommentToken,
            FunctionSectionMarkerToken,
            WhiteSpaceToken,
            LessThanToken,
            GreaterThanToken,
            ColonToken,
            EqualsToken,
            SemicolonToken,
            IdentifierToken,
        ],
        docTagComment: [
            DocTagCommentWhitespaceToken,
            DocTagCommentLineBreakToken,
            DocTagCommentToken,
            DocTextCommentToken,
        ],
    },
    defaultMode: "defaultMode",
});
