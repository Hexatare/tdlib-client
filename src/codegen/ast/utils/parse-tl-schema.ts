import { TlSchemaModel } from "../models/schema.js";
import type { TlSchema } from "../models/schema.js";

export function parseTlSchema(value: unknown): TlSchema {
    return TlSchemaModel.parse(value);
}
