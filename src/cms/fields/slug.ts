import type { Field, FieldHook } from "payload";

const POLISH_CHAR_MAP: Readonly<Record<string, string>> = Object.freeze({
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
});

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => POLISH_CHAR_MAP[char] ?? char)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createSlugHook(sourceField: string): FieldHook {
  return ({ value, data }) => {
    if (typeof value === "string" && value.trim().length > 0) {
      return slugify(value);
    }
    const source = data?.[sourceField];
    return typeof source === "string" ? slugify(source) : value;
  };
}

export function slugField(sourceField = "title"): Field {
  return {
    name: "slug",
    type: "text",
    label: "Adres (slug)",
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description: "Uzupełnia się sam z tytułu. Zmień tylko jeśli chcesz inny adres URL.",
    },
    hooks: { beforeValidate: [createSlugHook(sourceField)] },
  };
}
