/** Minimalny dokument Lexical z samych akapitów – wystarczy do treści startowych. */
export function paragraphsToLexical(paragraphs: readonly string[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        textFormat: 0,
        textStyle: "",
        children: [{ type: "text", text, format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
      })),
    },
  };
}
