"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, TileLayer } from "leaflet";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type { MapPoint } from "@/lib/geo/map-points";
import { pluralizePl } from "@/lib/utils";

const TILE_URL = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
} as const;
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
const MAX_ZOOM = 12;
const SINGLE_POINT_ZOOM = 10;
const FIT_PADDING_PX = 48;
const PIN_SIZE_PX = 30;

/** Dymek budujemy z elementów DOM (textContent), a nie z HTML-a – tytuły pochodzą z CMS. */
function buildPopup(point: MapPoint): HTMLElement {
  const container = document.createElement("div");
  container.className = "map-popup";
  const heading = document.createElement("p");
  heading.className = "map-popup-town";
  heading.textContent = point.town;
  container.append(heading);
  const list = document.createElement("ul");
  for (const project of point.projects) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = project.href;
    link.textContent = project.title;
    item.append(link);
    list.append(item);
  }
  container.append(list);
  return container;
}

function pinHtml(count: number): string {
  const label = count > 1 ? String(count) : "";
  return `<span class="map-pin" aria-hidden="true">${label}</span>`;
}

export function ProjectsMap({ points }: { readonly points: readonly MapPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tilesRef = useRef<TileLayer | null>(null);
  const [isInteractive, setInteractive] = useState(false);
  const { resolvedTheme } = useTheme();
  const tileUrl = resolvedTheme === "dark" ? TILE_URL.dark : TILE_URL.light;

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container || points.length === 0) {
      return;
    }
    // Leaflet dotyka `window`, więc ładujemy go dopiero w przeglądarce.
    import("leaflet").then((L) => {
      if (cancelled || mapRef.current) {
        return;
      }
      const map = L.map(container, { scrollWheelZoom: false, attributionControl: true, maxZoom: MAX_ZOOM });
      tilesRef.current = L.tileLayer(tileUrl, { attribution: TILE_ATTRIBUTION, maxZoom: MAX_ZOOM }).addTo(map);
      const latLngs = points.map((point) => L.latLng(point.lat, point.lng));
      for (const point of points) {
        const icon = L.divIcon({
          className: "map-pin-wrapper",
          html: pinHtml(point.projects.length),
          iconSize: [PIN_SIZE_PX, PIN_SIZE_PX],
          iconAnchor: [PIN_SIZE_PX / 2, PIN_SIZE_PX / 2],
        });
        L.marker([point.lat, point.lng], { icon, title: point.town, keyboard: true })
          .bindPopup(buildPopup(point))
          .addTo(map);
      }
      if (latLngs.length === 1) {
        map.setView(latLngs[0], SINGLE_POINT_ZOOM);
      } else {
        map.fitBounds(L.latLngBounds(latLngs), { padding: [FIT_PADDING_PX, FIT_PADDING_PX], maxZoom: SINGLE_POINT_ZOOM });
      }
      mapRef.current = map;
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      tilesRef.current = null;
    };
    // Mapę tworzymy raz na zestaw pinezek; motyw podmienia tylko kafelki (efekt niżej).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  useEffect(() => {
    tilesRef.current?.setUrl(tileUrl);
  }, [tileUrl]);

  /** Kółko myszy przybliża dopiero po kliknięciu w mapę – żeby nie „łapała” przewijania strony. */
  const enableScrollZoom = () => {
    if (!isInteractive) {
      mapRef.current?.scrollWheelZoom.enable();
      setInteractive(true);
    }
  };

  const projectCount = points.reduce((sum, point) => sum + point.projects.length, 0);

  return (
    <figure className="overflow-hidden rounded-lg border border-rule bg-surface">
      <div
        ref={containerRef}
        onClick={enableScrollZoom}
        className="projects-map h-[340px] w-full sm:h-[420px]"
        role="region"
        aria-label="Mapa miejscowości z realizacjami"
      />
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-rule px-4 py-3 text-sm text-ink-soft">
        <span>
          {projectCount} {pluralizePl(projectCount, "realizacja", "realizacje", "realizacji")} w {points.length}{" "}
          {pluralizePl(points.length, "miejscowości", "miejscowościach", "miejscowościach")}. Pokazuję tylko miejscowość,
          bez adresu.
        </span>
        {!isInteractive && <span>Kliknij mapę, żeby przybliżać kółkiem.</span>}
      </figcaption>
    </figure>
  );
}
