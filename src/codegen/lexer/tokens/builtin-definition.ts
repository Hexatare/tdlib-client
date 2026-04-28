import { createToken, Lexer } from "chevrotain";

export const BuiltinDoubleDefinitionToken = createToken({
    name: "BuiltinDoubleDefinition",
    pattern: "double ? = Double;",
    group: Lexer.SKIPPED,
});

export const BuiltinStringDefinitionToken = createToken({
    name: "BuiltinStringDefinition",
    pattern: "string ? = String;",
    group: Lexer.SKIPPED,
});

export const BuiltinInt32DefinitionToken = createToken({
    name: "BuiltinInt32Definition",
    pattern: "int32 = Int32;",
    group: Lexer.SKIPPED,
});

export const BuiltinInt53DefinitionToken = createToken({
    name: "BuiltinInt53Definition",
    pattern: "int53 = Int53;",
    group: Lexer.SKIPPED,
});

export const BuiltinInt64DefinitionToken = createToken({
    name: "BuiltinInt64Definition",
    pattern: "int64 = Int64;",
    group: Lexer.SKIPPED,
});

export const BuiltinBytesDefinitionToken = createToken({
    name: "BuiltinBytesDefinition",
    pattern: "bytes = Bytes;",
    group: Lexer.SKIPPED,
});

export const BuiltinBoolFalseDefinitionToken = createToken({
    name: "BuiltinBoolFalseDefinition",
    pattern: "boolFalse = Bool;",
    group: Lexer.SKIPPED,
});

export const BuiltinBoolTrueDefinitionToken = createToken({
    name: "BuiltinBoolTrueDefinition",
    pattern: "boolTrue = Bool;",
    group: Lexer.SKIPPED,
});

export const BuiltinVectorDefinitionToken = createToken({
    name: "BuiltinVectorDefinition",
    pattern: "vector {t:Type} # [ t ] = Vector t;",
    group: Lexer.SKIPPED,
});
