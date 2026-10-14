import { renderToString } from "react-dom/server";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/ui/ContactForm";
import { HeroSystemMap } from "@/components/visuals/HeroSystemMap";
import { Modal } from "@/components/ui/Modal";
import { ServiceCard, MetricCard, GlassCard } from "@/components/ui/Cards";
import { Timeline, PROCESS_STEPS } from "@/components/ui/Process";
import { Accordion } from "@/components/ui/Accordion";
import { CTABlock } from "@/components/ui/CTABlock";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SecurityLayers } from "@/components/visuals/SecurityLayers";
import { AutomationFlow } from "@/components/visuals/AutomationFlow";
import { WebShowcase } from "@/components/visuals/WebShowcase";
import { VulnDemo } from "@/components/visuals/VulnDemo";
import { SoftwareLifecycle } from "@/components/visuals/SoftwareLifecycle";
import { ScopeAuthorization } from "@/components/security/ScopeAuthorization";
import { ReportPreview } from "@/components/security/ReportPreview";
import { SeverityLegend } from "@/components/security/SeverityLegend";
import { TrustPrinciples } from "@/components/security/TrustPrinciples";
import { SeverityBadge } from "@/components/security/Severity";
import { SERVICES } from "@/lib/constants/services";
import { SERVICE_PAGES } from "@/lib/constants/content";

const cases: Array<[string, React.ReactElement, RegExp[]]> = [
  ["Navbar", <Navbar />, [/aria-label="Main"/, /aria-expanded="false"[^>]*aria-controls="services-panel"/, /aria-current="page"/, /aria-controls="mobile-menu"/, /id="mobile-menu"[^>]*role="dialog"/, /invisible/]],
  ["Footer", <Footer />, [/mr4316841@gmail\.com/, /wa\.me\/201029864288/, /rel="noopener noreferrer"/, /opens in a new tab/]],
  ["ContactForm", <ContactForm defaultService="Security" />, [/<label/, /novalidate/i, /Send project details/]],
  ["HeroSystemMap", <HeroSystemMap />, [/Select a node/, ...SERVICES.map((s) => new RegExp(`href="${s.href}"`))]],
  ["Modal", <Modal open={false} onClose={() => {}} title="T">x</Modal>, [/<dialog/, /aria-labelledby/]],
  ["ServiceCard", <ServiceCard service={SERVICES[0]} size="feature" />, [/View service/, /Security assessments/]],
  ["MetricCard(placeholder)", <MetricCard label="L" value="[ n ]" placeholder />, [/Placeholder/]],
  ["GlassCard", <GlassCard ticks>x</GlassCard>, [/ticks/]],
  ["Timeline", <Timeline steps={PROCESS_STEPS} />, [/tl-line/, /Discover/, /Improve/]],
  ["Accordion", <Accordion items={SERVICE_PAGES.security.faq} defaultOpenId="before" />, [/aria-expanded="true"/, /aria-expanded="false"/]],
  ["CTABlock", <CTABlock title="t" primary={{ label: "a", href: "/contact" }} />, [/<section/]],
  ["Button(link)", <Button href="https://x.example">a</Button>, [/target="_blank"/, /noopener noreferrer/]],
  ["SectionHeader", <SectionHeader title="T" index="01" eyebrow="E" />, [/<h2/]],
  ["SecurityLayers", <SecurityLayers />, [/<title/]],
  ["AutomationFlow", <AutomationFlow />, [/Run example/, /Example workflow/]],
  ["WebShowcase", <WebShowcase />, [/role="img"/]],
  ["VulnDemo", <VulnDemo />, [/Demo environment/, /Nothing is sent or scanned/]],
  ["SoftwareLifecycle", <SoftwareLifecycle />, [/Architecture/]],
  ["ScopeAuthorization", <ScopeAuthorization />, [/<h2/, /<h3/, /Authorization/, /Handling/]],
  ["ScopeAuthorization(as h3)", <ScopeAuthorization as="h3" />, [/<h3/, /<h4/]],
  ["ReportPreview", <ReportPreview />, [/Sample structure/, /not a real report/]],
  ["SeverityLegend", <SeverityLegend />, [/Informational/, /Critical/]],
  ["TrustPrinciples", <TrustPrinciples />, [/Responsible handling/]],
  ["SeverityBadge", <SeverityBadge severity="high" />, [/High/, /aria-hidden="true"/]],
];
let bad = 0;
for (const [name, el, checks] of cases) {
  let html = "";
  try { html = renderToString(el); } catch (e) { bad++; console.log("FAIL render", name, (e as Error).message); continue; }
  const miss = checks.filter((r) => !r.test(html)).map(String);
  const junk = /undefined|\[object Object\]|NaN/.test(html.replace(/transform:[^"]*/g, ""));
  if (miss.length || junk) { bad++; console.log("FAIL", name, miss, junk ? "(contains undefined/NaN)" : ""); } else console.log("ok  ", name, html.length + "B");
}
console.log(bad ? `${bad} FAILED` : "all rendered, all structural checks passed");
process.exit(bad ? 1 : 0);
