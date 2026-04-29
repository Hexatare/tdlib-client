import { z } from "zod";
import { TlClassModel } from "./class.js";
import { TlFunctionDeclarationModel, TlTypeDeclarationModel } from "./declaration.js";

export const TlSchemaModel = z.object({
    classes: z.array(TlClassModel),
    types: z.array(TlTypeDeclarationModel),
    functions: z.array(TlFunctionDeclarationModel),
});

export type TlSchema = z.infer<typeof TlSchemaModel>;
