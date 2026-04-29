import { TlAstVisitor } from "./visitor.js";
import type { CstNode } from "chevrotain";
import type { TlSchema } from "../models/schema.js";

export function buildTlSchemaAst(cst: CstNode): TlSchema {
    return new TlAstVisitor().visit(cst) as TlSchema;
}
