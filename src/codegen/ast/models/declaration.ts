import { z } from "zod";
import { TlDocTagModel } from "./doc-tag.js";
import { TlFieldModel } from "./field.js";
import { TlTypeModel } from "./type.js";

const TlDeclarationBaseModel = z.object({
    name: z.string(),
    description: z.string(),
    fields: z.array(TlFieldModel),
    resultType: TlTypeModel,
    docTags: z.array(TlDocTagModel),
});

export const TlTypeDeclarationModel = z.object({
    ...TlDeclarationBaseModel.shape,
    kind: z.literal("type"),
});

export const TlFunctionDeclarationModel = z.object({
    ...TlDeclarationBaseModel.shape,
    kind: z.literal("function"),
});

export const TlDeclarationModel = z.discriminatedUnion("kind", [
    TlTypeDeclarationModel,
    TlFunctionDeclarationModel,
]);

export type TlTypeDeclaration = z.infer<typeof TlTypeDeclarationModel>;
export type TlFunctionDeclaration = z.infer<typeof TlFunctionDeclarationModel>;
export type TlDeclaration = z.infer<typeof TlDeclarationModel>;
