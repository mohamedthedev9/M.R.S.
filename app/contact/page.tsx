import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { ContactForm } from "@/components/ui/ContactForm";
import { ContactFormFromUrl } from "@/components/ui/ContactFormFromUrl";
import { Section } from "@/components/ui/Section";
import { PAGES } from "@/lib/constants/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Contact", description: PAGES.contact.body, path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <PageHero title={PAGES.contact.title} description={PAGES.contact.body} />
      <Section bare labelledBy="contact-form-title">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <h2 id="contact-form-title" className="sr-only">Project details</h2>
            <Suspense fallback={<ContactForm />}><ContactFormFromUrl /></Suspense>
          </div>
          <aside aria-labelledby="channels-title">
            <h2 id="channels-title" className="mb-6 font-display text-2xl font-semibold">Other ways to reach us</h2>
            <ContactChannels />
          </aside>
        </div>
      </Section>
    </>
  );
}
