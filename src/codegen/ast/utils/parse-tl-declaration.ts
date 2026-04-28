import { TlDeclarationModel } from "../models/declaration.js";
import type { TlDeclaration } from "../models/declaration.js";

export function parseTlDeclaration(value: unknown): TlDeclaration {
    return TlDeclarationModel.parse(value);
}
