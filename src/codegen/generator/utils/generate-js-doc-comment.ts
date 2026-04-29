export function generateJsDocComment(description: string, isInline = false): string {
    const normalizedDescription = description.replaceAll("\n", " ").trim();

    if (isInline) {
        return ["/**", normalizedDescription, "*/"].join(" ");
    }

    return ["/**", ` * ${normalizedDescription}`, " */"].join("\n");
}
