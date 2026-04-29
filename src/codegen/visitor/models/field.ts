import { z } from "zod";
import { TlTypeModel } from "./type.js";

export const TlFieldModel = z.object({
    name: z.string(),
    description: z.string(),
    type: TlTypeModel,
});

export type TlField = z.infer<typeof TlFieldModel>;
