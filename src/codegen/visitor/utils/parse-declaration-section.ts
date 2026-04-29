import { DeclarationSectionModel } from "../models/declaration-section.js";
import type { DeclarationSection } from "../models/declaration-section.js";

export function parseDeclarationSection(value: unknown): DeclarationSection {
    return DeclarationSectionModel.parse(value);
}
