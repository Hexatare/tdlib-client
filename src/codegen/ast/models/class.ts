import { z } from "zod";

export const TlClassModel = z.object({
    name: z.string(),
    description: z.string(),
});

export type TlClass = z.infer<typeof TlClassModel>;
