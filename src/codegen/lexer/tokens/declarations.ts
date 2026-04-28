import { createToken } from "chevrotain";

export const LessThanToken = createToken({
    name: "LessThan",
    pattern: "<",
    label: "<",
});

export const GreaterThanToken = createToken({
    name: "GreaterThan",
    pattern: ">",
    label: ">",
});

export const ColonToken = createToken({
    name: "Colon",
    pattern: ":",
    label: ":",
});

export const EqualsToken = createToken({
    name: "Equals",
    pattern: "=",
    label: "=",
});

export const SemicolonToken = createToken({
    name: "Semicolon",
    pattern: ";",
    label: ";",
});

export const IdentifierToken = createToken({
    name: "Identifier",
    pattern: /[A-Za-z_][A-Za-z0-9_]*/,
});
