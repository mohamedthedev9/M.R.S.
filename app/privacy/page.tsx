import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { PRIVACY } from "@/lib/constants/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: PRIVACY.title, description: PRIVACY.description, path: "/privacy" });

export default function PrivacyPage() { return <LegalPage doc={PRIVACY} />; }
