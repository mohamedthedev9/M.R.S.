import { Shield, Workflow, Globe, ScanSearch, CodeXml, type LucideIcon } from "lucide-react";

export type ServiceSlug =
  | "security" | "automation" | "web-development" | "vulnerability-checker" | "software-development";

export interface Service {
  slug: ServiceSlug;
  name: string;
  /** one line for cards and nav */
  short: string;
  /** revealed on hover/focus of ServiceCard */
  capabilities: readonly string[];
  icon: LucideIcon;
  href: `/services/${ServiceSlug}`;
}

/**
 * Single source of truth for services (never duplicate this data).
 * Capability lists come from the project brief; the OWNER MUST CONFIRM each one
 * before launch so the site never claims a service M.R.S. does not offer.
 */
export const SERVICES: readonly Service[] = [
  { slug: "security", name: "Security", short: "Defensive reviews and hardening for your systems.",
    capabilities: ["Security assessments", "Hardening", "Access and configuration review", "Secure implementation"],
    icon: Shield, href: "/services/security" },
  { slug: "automation", name: "Automation", short: "Turn repeated manual work into reliable workflows.",
    capabilities: ["Data processing", "Report generation", "Scheduled routines", "API-driven workflows"],
    icon: Workflow, href: "/services/automation" },
  { slug: "web-development", name: "Web development", short: "Fast, accessible websites and web apps.",
    capabilities: ["Business sites", "Landing pages", "Dashboards", "Web applications"],
    icon: Globe, href: "/services/web-development" },
  { slug: "vulnerability-checker", name: "Vulnerability checker", short: "See known weaknesses, ranked by severity.",
    capabilities: ["Severity ranking", "Affected components", "Remediation guidance", "Risk summary"],
    icon: ScanSearch, href: "/services/vulnerability-checker" },
  { slug: "software-development", name: "Software development", short: "Android apps, internal tools and backend systems.",
    capabilities: ["Android applications", "Internal tools", "APIs and backends", "Custom business software"],
    icon: CodeXml, href: "/services/software-development" },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
