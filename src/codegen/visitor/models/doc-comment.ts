import { z } from "zod";

export const DocCommentModel = z.object({
    description: z.string(),
});

export type DocComment = z.infer<typeof DocCommentModel>;
