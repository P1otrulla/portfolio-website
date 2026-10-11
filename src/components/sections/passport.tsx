import type { SiteSetting } from "@/payload-types";
import { isNonEmpty } from "@/lib/utils";
import { ExternalLink } from "@/components/ui/button";

/** Stylizowana naklejka z rozdzielnicy – kod QR rysowany z prostych modułów (dekoracja, nie działający kod). */
const QR_PATTERN: readonly string[] = Object.freeze([
  "1111111010111111",
  "1000001001100001",
  "1011101011101101",
  "1011101100101101",
  "1000001010100001",
  "1111111010111111",
  "0000000110000000",
  "1101011011010110",
  "0110100101101011",
  "1011011000110100",
  "0000000101011011",
  "1111111011010010",
  "1000001001101101",
  "1011101110010110",
  "1000001010111001",
  "1111111001011011",
]);
const QR_MODULE = 6;

function QrSticker() {
  const size = QR_PATTERN.length * QR_MODULE;
  return (
    <div className="w-[min(100%,210px)] rotate-[-2deg] rounded-lg border border-rule bg-white p-5 text-[#16202c] shadow-[0_18px_40px_-20px_rgba(22,32,44,0.45)]">
      <div className="flex items-center justify-between text-[0.72rem] font-semibold">
        <span>PASZPORT INSTALACJI</span>
        <span className="h-2 w-8 rounded-sm pe-stripe" aria-hidden="true" />
      </div>
      <svg viewBox={`0 0 ${size} ${size}`} className="mt-3 w-full" aria-hidden="true" shapeRendering="crispEdges">
        {QR_PATTERN.flatMap((row, y) =>
          [...row].map((cell, x) =>
            cell === "1" ? <rect key={`${x}-${y}`} x={x * QR_MODULE} y={y * QR_MODULE} width={QR_MODULE} height={QR_MODULE} fill="#16202c" /> : null,
          ),
        )}
      </svg>
      <p className="mt-3 text-[0.72rem] leading-snug text-[#536072]">Zeskanuj, aby zobaczyć opis obwodów tej rozdzielnicy.</p>
    </div>
  );
}

export function Passport({ settings }: { readonly settings: SiteSetting }) {
  if (!settings.passportEnabled || !isNonEmpty(settings.passportTitle)) {
    return null;
  }
  return (
    <section aria-labelledby="passport-title" className="mx-auto max-w-[1200px] px-4 sm:px-6">
      <div className="grid items-center gap-10 rounded-xl border border-rule bg-surface p-6 sm:p-10 md:grid-cols-[1fr_auto] md:gap-12">
        <div>
          <h2 id="passport-title" className="heading text-[clamp(1.6rem,3vw,2.2rem)]">
            {settings.passportTitle}
          </h2>
          {settings.passportText && <p className="mt-4 max-w-[60ch] text-[1.05rem] text-ink-soft">{settings.passportText}</p>}
          {isNonEmpty(settings.passportUrl) && (
            <ExternalLink href={settings.passportUrl} className="link mt-6 inline-block font-medium">
              Zobacz przykładowy paszport
            </ExternalLink>
          )}
        </div>
        <div className="flex justify-center md:justify-end">
          <QrSticker />
        </div>
      </div>
    </section>
  );
}
