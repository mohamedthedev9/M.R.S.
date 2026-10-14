"use client";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";
import { CONTACT_SERVICE_OPTION } from "@/lib/constants/content";
import type { ServiceSlug } from "@/lib/constants/services";

/**
 * Reads ?service=<slug> on the client, so /contact can stay statically rendered
 * (reading searchParams on the server would force the whole page to render per request).
 * Must be wrapped in <Suspense>.
 */
export function ContactFormFromUrl() {
  const slug = useSearchParams().get("service") as ServiceSlug | null;
  return <ContactForm defaultService={(slug && CONTACT_SERVICE_OPTION[slug]) || ""} />;
}
