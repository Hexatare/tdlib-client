import { z } from "zod";

export const TlDocTagModel = z.object({
    tag: z.string(),
    text: z.string(),
});

export type TlDocTag = z.infer<typeof TlDocTagModel>;
