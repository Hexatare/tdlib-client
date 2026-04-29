export function stripTagPrefix(tag: string): string {
    return tag.startsWith("@") ? tag.slice(1) : tag;
}
