"use client";
// components/layout/SiteSettingsProvider.tsx
import { createContext, useContext } from "react";

export interface SiteSettings {
  site_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  twitter: string;
  facebook: string;
}

const defaultSettings: SiteSettings = {
  site_name: "Jovico Bikes",
  tagline: "Ride Electric. Ride Lagos.",
  phone: "+234 801 234 5678",
  email: "hello@jovicobikes.com",
  address: "14 Adeola Odeku Street, Victoria Island, Lagos",
  whatsapp: "+2348012345678",
  instagram: "https://instagram.com/jovicobikes",
  twitter: "https://twitter.com/jovicobikes",
  facebook: "https://facebook.com/jovicobikes",
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function SiteSettingsProvider({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: Partial<SiteSettings>;
}) {
  const merged = { ...defaultSettings, ...settings };
  return (
    <SiteSettingsContext.Provider value={merged}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
