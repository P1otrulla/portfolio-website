import type { Access } from "payload";

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);

export const anyone: Access = () => true;

/** Publicznie widoczne tylko opublikowane wersje; zalogowany widzi też szkice. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) {
    return true;
  }
  return { _status: { equals: "published" } };
};
