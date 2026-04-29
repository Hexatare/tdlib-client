export function joinCommentText(text: string, continuations?: string[]): string {
    return [text.trim(), ...(continuations ?? [])].filter(Boolean).join("\n");
}
