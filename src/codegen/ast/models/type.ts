import { z } from "zod";

export const TlTypeModel = z.union([
    z.object({
        kind: z.literal("name"),
        name: z.string(),
    }),
    z.object({
        kind: z.literal("generic"),
        name: z.string(),
        get argument() {
            return TlTypeModel;
        },
    }),
]);

export type TlType = z.infer<typeof TlTypeModel>;
