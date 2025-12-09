import type { Metadata, Viewport } from "next";
import ClientPortalClient from "./ClientPortalClient";

export const metadata: Metadata = {
  title: "Opening Simple Tattooer…",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function ClientPortal() {
  return <ClientPortalClient />;
}


