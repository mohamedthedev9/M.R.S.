import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { TERMS } from "@/lib/constants/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: TERMS.title, description: TERMS.description, path: "/terms" });

export default function TermsPage() { return <LegalPage doc={TERMS} />; }
