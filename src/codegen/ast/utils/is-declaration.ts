import { TlDeclarationModel } from "../models/declaration.js";
import type { TlDeclaration } from "../models/declaration.js";

export function isDeclaration(item: unknown): item is TlDeclaration {
    return TlDeclarationModel.safeParse(item).success;
}
