import { z } from "zod";

const StringArrayModel = z.array(z.string());

export function parseStringArray(value: unknown): string[] {
    return StringArrayModel.parse(value);
}
