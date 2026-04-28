import { z } from "zod";
import { TlClassModel } from "./class.js";
import { TlDeclarationModel } from "./declaration.js";

export const DeclarationSectionModel = z.object({
    classes: z.array(TlClassModel),
    declarations: z.array(TlDeclarationModel),
});

export type DeclarationSection = z.infer<typeof DeclarationSectionModel>;
