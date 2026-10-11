import type { CollectionConfig } from "payload";
import { COLLECTION } from "@/lib/constants";

export const Users: CollectionConfig = {
  slug: COLLECTION.USERS,
  labels: { singular: "Użytkownik", plural: "Użytkownicy" },
  admin: { useAsTitle: "email", group: "System" },
  auth: true,
  fields: [{ name: "name", type: "text", label: "Imię" }],
};
