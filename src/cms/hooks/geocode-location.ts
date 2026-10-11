import type { CollectionBeforeChangeHook } from "payload";
import type { Project } from "@/payload-types";
import { PROJECT_CATEGORY } from "@/lib/constants";
import { geocodeTown } from "@/lib/geo/geocoder";
import { isNonEmpty } from "@/lib/utils";

const hasCoordinates = (geo: Project["geo"] | undefined): boolean =>
  typeof geo?.lat === "number" && typeof geo?.lng === "number";

/**
 * Przy zapisie realizacji elektrycznej zamienia miejscowość na współrzędne do mapy.
 * Ręcznie wpisane współrzędne zostają, dopóki nie zmienisz miejscowości.
 */
export const geocodeLocation: CollectionBeforeChangeHook<Project> = async ({ data, originalDoc }) => {
  const category = data.category ?? originalDoc?.category;
  const location = data.location ?? originalDoc?.location;
  if (category !== PROJECT_CATEGORY.ELECTRICAL || !isNonEmpty(location)) {
    return data;
  }
  const locationChanged = location.trim() !== (originalDoc?.location ?? "").trim();
  if (!locationChanged && hasCoordinates(data.geo ?? originalDoc?.geo)) {
    return data;
  }
  const point = await geocodeTown(location);
  return point ? { ...data, geo: { lat: point.lat, lng: point.lng } } : data;
};
