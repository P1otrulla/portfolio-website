import { Github, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SiteSetting } from "@/payload-types";
import { isNonEmpty } from "@/lib/utils";

export interface ContactChannel {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly external: boolean;
}

const PHONE_HREF_SANITIZER = /[^\d+]/g;

/** Jedno źródło prawdy dla kanałów kontaktu – używane w stopce i sekcji kontaktu. */
export function buildContactChannels(settings: SiteSetting): readonly ContactChannel[] {
  const channels: ContactChannel[] = [];
  if (isNonEmpty(settings.phone)) {
    channels.push({
      key: "phone",
      label: "Telefon",
      value: settings.phone,
      href: `tel:${settings.phone.replace(PHONE_HREF_SANITIZER, "")}`,
      icon: Phone,
      external: false,
    });
  }
  if (isNonEmpty(settings.email)) {
    channels.push({
      key: "email",
      label: "E-mail",
      value: settings.email,
      href: `mailto:${settings.email}`,
      icon: Mail,
      external: false,
    });
  }
  if (isNonEmpty(settings.discordUrl)) {
    channels.push({ key: "discord", label: "Discord", value: "Napisz na Discordzie", href: settings.discordUrl, icon: MessageCircle, external: true });
  }
  if (isNonEmpty(settings.githubUrl)) {
    channels.push({ key: "github", label: "GitHub", value: "Repozytoria", href: settings.githubUrl, icon: Github, external: true });
  }
  if (isNonEmpty(settings.linkedinUrl)) {
    channels.push({ key: "linkedin", label: "LinkedIn", value: "Profil zawodowy", href: settings.linkedinUrl, icon: Linkedin, external: true });
  }
  return channels;
}
