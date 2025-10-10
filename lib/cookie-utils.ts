"use client";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

export const COOKIE_CONSENT_KEY = "cookie-consent";

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    return consent ? JSON.parse(consent) : null;
  } catch (error) {
    console.error("Error reading cookie preferences:", error);
    return null;
  }
}

export function setCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving cookie preferences:", error);
  }
}

export function hasConsent(): boolean {
  return getCookiePreferences() !== null;
}

export function canUseAnalytics(): boolean {
  const preferences = getCookiePreferences();
  return preferences?.analytics === true;
}

export function clearCookiePreferences(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch (error) {
    console.error("Error clearing cookie preferences:", error);
  }
}

export function setCookie(
  name: string,
  value: string,
  days: number = 365,
): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Analytics functions (placeholder for Google Analytics or other tracking)
export function enableAnalytics(): void {
  if (!canUseAnalytics()) return;

  // Here you would typically initialize Google Analytics or other tracking
  console.log("Analytics enabled");

  // Example: Enable Google Analytics
  // gtag('consent', 'update', {
  //     'analytics_storage': 'granted'
  // })
}

export function disableAnalytics(): void {
  // Here you would typically disable Google Analytics or other tracking
  console.log("Analytics disabled");

  // Example: Disable Google Analytics
  // gtag('consent', 'update', {
  //     'analytics_storage': 'denied'
  // })
}
