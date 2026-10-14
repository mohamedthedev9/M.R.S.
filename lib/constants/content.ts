import type { ServiceSlug } from "./services";

/**
 * All site copy. Single source of truth: components import from here, never hardcode copy.
 *
 * Markers (searchable; `node tools/check-placeholders.js` fails the production build while any remain):
 *   [PLACEHOLDER: x]        a fact only the owner can supply
 *   [CONFIRM WITH OWNER: x] a statement written as design copy that must be true before launch
 * Nothing here invents clients, years, revenue, certifications, partners, statistics or testimonials.
 */

export const SITE = {
  name: "M.R.S.",
  legalName: "Mohamed Reda Services",
  founder: "Mohamed Reda",
  alias: "MohamedTheDev", // how the founder is known online (TikTok: @mohamedthedev)
  tagline: "Digital systems. Secure infrastructure. Intelligent execution.",
  metaTitle: "M.R.S. | Websites, software, automation and security",
  metaDescription:
    "M.R.S. (Mohamed Reda Services) builds websites, apps and automations, and runs defensive security and vulnerability checks.",
  contactEmail: "mr4316841@gmail.com",
  location: "Qalyubia, Egypt and Florida, USA",
  /** Channels supplied by the owner. Handles/numbers only; no follower counts or other claims. */
  social: {
    whatsapp: { name: "WhatsApp", label: "+20 102 986 4288", href: "https://wa.me/201029864288" },
    facebook: { name: "Facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61592754163260" },
    tiktok: { name: "TikTok", label: "@mohamedthedev", href: "https://www.tiktok.com/@mohamedthedev" },
  },
  year: 2026,
} as const;

export const NAV = [
  { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Work", href: "/work" },
  { label: "Process", href: "/process" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
] as const;
export const NAV_CTA = { label: "Start a project", href: "/contact" } as const;

/* ---------- Process (single definition, reused by home, /process and service pages) ---------- */
export interface ProcessItem { title: string; body: string; happens: string; youProvide: string; youReceive: string }
export const PROCESS: readonly ProcessItem[] = [
  { title: "Discover", body: "We learn the problem, the people involved and what success looks like.",
    happens: "A short conversation, then written notes on the problem, users and constraints.",
    youProvide: "Access to the people and systems involved, and a description of what's not working.",
    youReceive: "A one-page summary of the problem, confirmed with you." },
  { title: "Plan", body: "Scope, structure and order of work, reviewed before anything is built.",
    happens: "We define what's in and out of scope, the approach and the order of work.",
    youProvide: "Decisions on priorities, and written authorization for any security work.",
    youReceive: "A scoped plan. Timeline and price are confirmed in writing before any work starts." },
  { title: "Build", body: "Focused delivery in small steps, so progress is visible.",
    happens: "We build in small pieces and show working results as they appear.",
    youProvide: "Feedback on each piece, and content or access when we ask for it.",
    youReceive: "Working increments you can review along the way." },
  { title: "Test", body: "Functional, accessibility and security-minded checks before release.",
    happens: "We test the result against the plan, on real devices and realistic cases.",
    youProvide: "Real-world examples and edge cases from your daily use.",
    youReceive: "A list of what was checked and what was fixed." },
  { title: "Launch", body: "Deployment, handover and documentation.",
    happens: "We release the work and walk your team through it.",
    youProvide: "Approval to go live, and hosting or account access where needed.",
    youReceive: "The live result and written documentation. Handover is agreed in writing." },
  { title: "Improve", body: "Measure, fix and extend based on real use.",
    happens: "We review how it performs in use and fix or extend what matters.",
    youProvide: "Feedback from real users.",
    youReceive: "A short list of next improvements. Ongoing support is agreed separately, if you want it." },
];

/* ---------- Homepage ---------- */
export const HOME = {
  hero: {
    meta: "M.R.S. / Mohamed Reda Services",
    title: "Build it. Secure it. Automate the rest.",
    body: "M.R.S. designs and builds websites, apps and automations, and checks them for security weaknesses so they hold up in real use.",
    primaryCta: { label: "Start a project", href: "/contact" },
    secondaryCta: { label: "See what we do", href: "#capabilities" },
    /** system map nodes around the central M.R.S. node */
    nodes: ["Security", "Automation", "Web", "Vulnerability checks", "Software"],
  },
  capabilities: {
    id: "capabilities",
    title: "Five capabilities, one system.",
    body: "Most digital problems cross more than one of these. A website needs security. A workflow needs software. We work across all five, so you don't coordinate five suppliers.",
  },
  operatingModel: {
    id: "how-it-works",
    title: "Observe, then act.",
    body: "Every project follows the same order, whatever the size.",
    steps: [
      { name: "Observe", text: "Understand the system as it is: what runs, who uses it and where it breaks." },
      { name: "Plan", text: "Decide scope, structure and the order of work." },
      { name: "Execute", text: "Build, change or automate in small, reviewable steps." },
      { name: "Verify", text: "Test the result and show you the evidence." },
    ],
  },
  security: {
    title: "Know where your systems are exposed.",
    body: "Websites, apps and accounts all have settings and code that can be set up wrongly. We review them, fix what we're authorized to fix, and give you a short list of what matters most, in plain language.",
    points: ["Security assessments", "Hardening", "Access and configuration review", "Security-minded development"],
    cta: { label: "Explore security", href: "/services/security" },
  },
  automation: {
    title: "Stop doing the same task twice.",
    body: "If someone on your team repeats a task every day or week, there is often a way to make a workflow do it. The workflow runs on schedule and keeps a record of every run.",
    transform: [
      { stage: "Manual work", text: "Download the export, fix the columns, paste into the template, email the team." },
      { stage: "Automated workflow", text: "A scheduled job collects, checks and formats the data." },
      { stage: "Reliable output", text: "The same report arrives every time, with a log of each run." },
    ],
    examples: ["Data processing", "File organization", "Report generation", "Notifications", "Scheduled routines", "API-driven workflows", "Internal tools"],
    cta: { label: "Explore automation", href: "/services/automation" },
  },
  web: {
    title: "Websites built as products, not pages.",
    body: "Fast, accessible and easy to update. From a single landing page to a dashboard or a full web application.",
    kinds: [
      { name: "Marketing sites", text: "Explain what you do and make it easy to get in touch." },
      { name: "Business systems", text: "Sites that connect to the tools your team already uses." },
      { name: "Dashboards", text: "Your numbers in one place, readable at a glance." },
      { name: "Web applications", text: "Custom tools that run in the browser." },
    ],
    cta: { label: "Explore web development", href: "/services/web-development" },
  },
  vulnerability: {
    title: "See weaknesses ranked by severity.",
    body: "A vulnerability check lists known weaknesses in your systems, how serious each one is, which component it affects and how to fix it. The panel below is a demo with sample data.",
    note: "Checks run only on systems you own or are authorized to test.",
    cta: { label: "Explore vulnerability checks", href: "/services/vulnerability-checker" },
  },
  software: {
    title: "Software built around how you work.",
    body: "When off-the-shelf tools force your process to fit them, custom software can close the gap, if it is scoped and built carefully.",
    kinds: ["Mobile apps", "Custom business software", "Internal tools", "APIs and backend systems"],
    cta: { label: "Explore software development", href: "/services/software-development" },
  },
  process: { title: "From first call to launch.", body: "Six steps, in this order. You see something real at every stage." },
  work: {
    title: "Selected work",
    body: "A project we built, plus concepts that show the kind of problem we solve.",
    projects: [
      { kind: "project", badge: "Open source", title: "mtdOS", meta: "Open-source systems software · 2026",
        text: "An open-source ARM64 kernel project. Built with GitHub Actions to compile ELF binaries, and tested in QEMU emulation.",
        href: "https://mohamedthedev9.github.io/MTD/" },
    ],
    concepts: [
      { kind: "concept", title: "Concept: self-building weekly report", meta: "Automation", text: "A scheduled workflow gathers the week's data and delivers a formatted report." },
      { kind: "concept", title: "Concept: team dashboard", meta: "Web application", text: "One screen showing the numbers a team asks about every week." },
      { kind: "concept", title: "Concept: field-team Android app", meta: "Software", text: "A simple app for staff who work away from a desk." },
    ],
    conceptNote: "Concepts are illustrations, not past client work.",
  },
  principles: {
    title: "How we work",
    body: "Security work especially depends on clear rules. These apply to every project.",
    items: [
      { name: "Clarity", text: "Plain language, written scope and no surprises." },
      { name: "Scope", text: "We agree what is in and out before work starts." },
      { name: "Authorization", text: "We only test systems you own or are authorized to test." },
      { name: "Evidence", text: "Findings and results come with proof, not assertions." },
      { name: "Remediation", text: "Every problem we report comes with a way to fix it." },
      { name: "Responsible handling", text: "Your data and findings stay with you. See the Privacy Policy." },
    ],
    techStackLabel: "Technologies we work with",
    techStack: ["HTML", "CSS", "JavaScript", "Python", "Next.js", "Tailwind CSS"],
  },
  finalCta: {
    title: "Tell us what you need built.",
    body: "Describe the problem in a few sentences. We reply with questions or a scoped plan.",
    primary: { label: "Start a project", href: "/contact" },
    secondary: { label: "See the process", href: "/process" },
  },
} as const;

/* ---------- Service pages (the nine blocks defined in Phase 2) ---------- */
export interface Faq { id: string; question: string; answer: string }
export interface ServicePage {
  hero: { title: string; body: string };
  problem: string;
  capabilities: readonly { name: string; text: string }[];
  demoCaption: string;
  process: readonly { title: string; text: string }[];
  outcomes: readonly string[]; // illustrative, shown with a "Concept" label
  technical: readonly string[];
  faq: readonly Faq[];
  cta: { title: string; label: string };
  extra?: { title: string; items: readonly string[] };
}

export const SERVICE_PAGES: Record<ServiceSlug, ServicePage> = {
  security: {
    hero: { title: "Security you can explain to your team.", body: "Reviews, hardening and secure building for websites, apps and accounts." },
    problem: "Most security problems are ordinary: a setting left open, an account with too much access, an update nobody applied. They stay invisible until something goes wrong. A review makes them visible while they are cheap to fix.",
    capabilities: [
      { name: "Security assessments", text: "A structured review of a website, app or system within an agreed scope." },
      { name: "Hardening", text: "Tighten configuration and remove what isn't needed." },
      { name: "Access and configuration review", text: "Who can reach what, and whether they should." },
      { name: "Secure implementation", text: "New features built with safe defaults, careful input handling and clear permissions." },
      { name: "Remediation guidance", text: "Each finding comes with a specific fix, in priority order." },
      { name: "Reporting", text: "A written summary you can share with your team." },
    ],
    demoCaption: "Three layers around the system that matters: perimeter, access, application.",
    process: [
      { title: "Agree scope", text: "Write down what is in scope and confirm you are authorized to test it." },
      { title: "Review", text: "Examine configuration, access and code within that scope." },
      { title: "Report", text: "Findings, evidence and fixes, ranked by priority." },
      { title: "Fix and recheck", text: "Apply fixes and confirm they worked." },
    ],
    outcomes: ["A prioritized fix list instead of an unranked pile of warnings.", "A clear answer to who has access to what.", "A site or app launched with safe defaults."],
    technical: [
      "Scope is written down before any review starts.",
      "We only test systems you own or are authorized to test.",
      "Each finding lists the affected component, evidence and a fix.",
      "Reports describe weaknesses and fixes, not attack instructions.",
    ],
    faq: [
      { id: "before", question: "What do you need before a review starts?", answer: "Written confirmation that you own or are authorized to test the systems in scope, and a list of what is in scope." },
      { id: "others", question: "Do you test systems you don't own?", answer: "No. Reviews cover only systems you own or are explicitly authorized to test." },
      { id: "time", question: "How long does a review take?", answer: "It depends on scope. The written plan states the timeline before any work starts." },
      { id: "receive", question: "What do I receive at the end?", answer: "A written report with findings, severity, affected components and recommended fixes. The format is agreed when the scope is set." },
    ],
    cta: { title: "Ask about a security review.", label: "Ask about a review" },
    extra: { title: "Scope and authorization", items: ["Every engagement starts with a written scope.", "Authorization is confirmed before testing begins.", "Findings are shared only with you."] },
  },
  automation: {
    hero: { title: "Automate what you repeat.", body: "Turn routine tasks into workflows that run on schedule and leave a record." },
    problem: "Repeated manual work costs time and invites mistakes: copy, paste, rename, send, repeat. People keep doing it because building something better never feels urgent.",
    capabilities: [
      { name: "Data processing", text: "Clean, convert and move data between files, spreadsheets and systems." },
      { name: "File organization", text: "Sort, rename and archive files by rules." },
      { name: "Report generation", text: "Build recurring reports automatically." },
      { name: "Notifications", text: "Send alerts and reminders when conditions are met." },
      { name: "Scheduled routines", text: "Run tasks at set times, without anyone remembering." },
      { name: "API-driven workflows", text: "Connect tools that offer an API so they work together." },
      { name: "Internal tools", text: "Small apps your team uses to run a routine task." },
    ],
    demoCaption: "An example workflow: trigger, logic, action, result.",
    process: [
      { title: "Map the task", text: "Write down each step as it happens today." },
      { title: "Build the workflow", text: "Turn the steps into a workflow with clear checks." },
      { title: "Test with real cases", text: "Run it on your real files and edge cases." },
      { title: "Hand over", text: "Document how it works and how to change it." },
    ],
    outcomes: ["A weekly report that builds itself.", "Incoming files sorted and named the same way every time.", "An alert only when something needs a person."],
    technical: [
      "Each run is logged, so you can see what happened.",
      "Failures are reported, not hidden.",
      "Credentials live in secure configuration, never in code.",
      "Documentation is handed over with the workflow.",
    ],
    faq: [
      { id: "suit", question: "Which tasks suit automation?", answer: "Tasks that follow clear rules and repeat: moving data, producing reports, sorting files, sending routine messages." },
      { id: "fail", question: "What happens if a workflow fails?", answer: "The failure is logged. Alerts for failed runs can be included in the workflow's scope." },
      { id: "tools", question: "Do I have to change my tools?", answer: "Often not. Tools that offer an API or exportable files can usually be connected as they are." },
    ],
    cta: { title: "Tell us what you repeat.", label: "Describe a task" },
    extra: { title: "Before and after", items: ["Before: download the export, fix the columns, paste, email.", "After: a scheduled job does it and logs the run."] },
  },
  "web-development": {
    hero: { title: "Websites built as products.", body: "Fast, accessible and easy to maintain, from a single landing page to a full web application." },
    problem: "A site that loads slowly, breaks on phones or can't be updated without a developer stops doing its job. Visitors leave, and the team works around it.",
    capabilities: [
      { name: "Business websites", text: "Clear sites that explain what you do and how to reach you." },
      { name: "Landing pages", text: "Focused pages for one campaign or one offer." },
      { name: "Dashboards", text: "Your numbers in one place, readable at a glance." },
      { name: "Web applications", text: "Custom tools that run in the browser." },
      { name: "CMS integration", text: "Let your team update content without touching code." },
      { name: "Performance and accessibility", text: "Fast loading, keyboard-friendly and readable on any screen." },
    ],
    demoCaption: "A concept layout. Real projects appear under Selected Work once published.",
    process: [
      { title: "Structure", text: "Decide pages, content and what each visitor should do." },
      { title: "Design", text: "Layouts for phone and desktop, reviewed with you." },
      { title: "Build", text: "Responsive, accessible implementation." },
      { title: "Launch", text: "Deploy, check and hand over." },
    ],
    outcomes: ["A site your team can update without a developer.", "A dashboard that answers the questions people ask every week.", "A landing page that loads fast on a phone."],
    technical: [
      "Responsive from small phones to wide screens.",
      "Semantic HTML and keyboard navigation.",
      "Optimized images and fonts.",
      "Stack: Next.js, Tailwind CSS, HTML, CSS and JavaScript.",
    ],
    faq: [
      { id: "existing", question: "Can you improve my existing site?", answer: "Usually. We review how it is built first, then recommend whether to fix or rebuild." },
      { id: "own", question: "Who owns the finished site?", answer: "Ownership and licensing are set out in the written agreement for each project, before work starts." },
      { id: "host", question: "Do you handle hosting?", answer: "We deploy our own projects on Vercel and GitHub Pages. Hosting and ongoing maintenance for your project are agreed in writing." },
    ],
    cta: { title: "Plan your website.", label: "Plan a website" },
  },
  "vulnerability-checker": {
    hero: { title: "See weaknesses before they become incidents.", body: "A vulnerability check lists known weaknesses, ranks them by severity and says how to fix each one." },
    problem: "Systems collect known weaknesses over time: outdated components, exposed settings, weak defaults. Without a list, you can't tell which ones matter or where to start.",
    capabilities: [
      { name: "Severity ranking", text: "Critical, high, medium, low and informational." },
      { name: "Affected component", text: "Which part of the system each finding relates to." },
      { name: "Reference identifiers", text: "Standard identifiers where they exist." },
      { name: "Remediation guidance", text: "A recommended fix for each finding." },
      { name: "Risk summary", text: "A short overview you can read in a minute." },
      { name: "Re-check", text: "Confirm that fixes worked." },
    ],
    demoCaption: "Demo only. The scanner below uses sample data and never contacts a real system.",
    process: [
      { title: "Confirm scope", text: "List the assets and confirm you are authorized to check them." },
      { title: "Check", text: "Run the agreed checks against those assets." },
      { title: "Review", text: "Go through the findings together, in priority order." },
      { title: "Fix and re-check", text: "Apply fixes and verify them." },
    ],
    outcomes: ["A ranked list that says what to fix first.", "A record of what was checked and when.", "A clear before and after once fixes are applied."],
    technical: [
      "Checks run only on assets you've authorized in writing.",
      "Severity levels: critical, high, medium, low, informational.",
      "The demo on this page uses synthetic data.",
      "The checks that run, and how results are reviewed, are described in the written scope for each engagement.",
    ],
    faq: [
      { id: "real", question: "Is the demo a real scan?", answer: "No. It is an interface demonstration with sample data. Nothing is sent or scanned." },
      { id: "any", question: "Can you check any website?", answer: "No. We check only systems you own or are authorized to test." },
      { id: "data", question: "Who sees the results?", answer: "Only you, unless the law requires otherwise. See the Privacy Policy." },
    ],
    cta: { title: "Request a vulnerability check.", label: "Request a check" },
  },
  "software-development": {
    hero: { title: "Software built around how you work.", body: "Android apps, internal tools, APIs and custom business software, from idea to release and beyond." },
    problem: "Off-the-shelf tools make you fit your process to their features. When that gap gets expensive, custom software is the alternative, if it is scoped and built with care.",
    capabilities: [
      { name: "Android applications", text: "Apps for phones and tablets." },
      { name: "Web applications", text: "Tools that run in the browser, with no install." },
      { name: "Internal tools", text: "Software that replaces shared spreadsheets and manual steps." },
      { name: "APIs and backend systems", text: "The services behind apps and integrations." },
      { name: "Desktop utilities", text: "Where a desktop tool is the right fit." },
      { name: "Custom business software", text: "Systems shaped around your operations." },
    ],
    demoCaption: "The lifecycle every project follows. Improve feeds the next idea.",
    process: [
      { title: "Idea and architecture", text: "Define what it does and how it is structured." },
      { title: "Build", text: "Deliver in small, working pieces." },
      { title: "Test and release", text: "Check on real devices, then ship." },
      { title: "Improve", text: "Learn from use and iterate." },
    ],
    outcomes: ["An internal tool that replaces a shared spreadsheet.", "An Android app for a team that works away from a desk.", "An API that connects two systems that don't talk."],
    technical: [
      "Tested before every release.",
      "Security considered at design stage.",
      "Stack: Python, plus the web technologies listed under Web development. Android tooling is chosen per project.",
      "Source code and documentation handover is agreed in the project's written agreement.",
    ],
    faq: [
      { id: "ios", question: "Do you build iPhone apps?", answer: "The focus is Android applications and web applications, which also work in iPhone browsers. Other platforms can be discussed per project." },
      { id: "code", question: "Who owns the code?", answer: "Ownership of the code is set out in the written agreement for each project, before work starts." },
      { id: "takeover", question: "Can you take over an existing project?", answer: "Possibly. We review the code first and tell you what we find." },
    ],
    cta: { title: "Describe your project.", label: "Describe a project" },
    extra: {
      title: "What helps us scope your project",
      items: ["Who will use it, and what they need to do.", "Which systems it must connect to.", "Which devices and platforms it must run on.", "What is essential now and what can wait.", "Your deadline and any constraints.", "Who will maintain it afterward."],
    },
  },
};

/* ---------- Other pages ---------- */
export const PAGES = {
  services: { title: "Five capabilities, one system.", body: "Pick the one that matches your problem, or start a project and we'll help you choose." },
  work: { title: "Selected work", body: HOME.work.body },
  process: { title: "How a project runs.", body: "Six steps. At each one, here is what happens, what we need from you and what you receive." },
  about: {
    title: "About M.R.S.",
    body: "M.R.S. stands for Mohamed Reda Services. It was founded by Mohamed Reda.",
    sections: [
      { title: "Who we are", text: "M.R.S. was founded by Mohamed Reda, an Egyptian software developer and digital content creator who is also known online as MohamedTheDev. He also leads MTD, a technology organization he founded in 2022." },
      { title: "What we do", text: "We build websites, apps and automations, and run defensive security and vulnerability checks." },
      { title: "Where we work", text: "Qalyubia, Egypt and Florida, USA." },
      { title: "Beyond client work", text: "Mohamed builds open-source systems software and creates technology content on TikTok (@mohamedthedev), covering hardware and software." },
    ],
  },
  contact: {
    title: "Start a project.",
    body: "Tell us what you need. A few sentences are enough.",
    fields: { name: "Your name", email: "Email", service: "What do you need?", message: "Describe your project", budget: "Budget range (optional)", timeline: "Timeline (optional)" },
    serviceOptions: ["Security", "Automation", "Web development", "Vulnerability check", "Software development", "Not sure yet"],
    submit: "Send project details",
    errors: { name: "Enter your name.", email: "Enter a valid email address, like name@example.com.", message: "Describe your project in at least a sentence." },
    demoSuccess: "This is a preview of the form. Submissions are not sent yet. To reach M.R.S. now, message us on WhatsApp or email.",
    alt: "Prefer to talk? Message us on WhatsApp or email.",
    privacyLink: "Read the Privacy Policy",
  },
  error: { title: "Something went wrong.", body: "An unexpected error stopped this page from loading. You can try again, or reach us directly on WhatsApp or by email.", retry: "Try again", home: "Go to the homepage" },
  notFound: { title: "This page doesn't exist.", body: "The link may be wrong or the page may have moved.", cta: { label: "Go to the homepage", href: "/" } },
} as const;

/** Maps ?service=<slug> to the matching <option> in the contact form. Must stay in sync with PAGES.contact.serviceOptions. */
export const CONTACT_SERVICE_OPTION: Record<ServiceSlug, (typeof PAGES.contact.serviceOptions)[number]> = {
  security: "Security", automation: "Automation", "web-development": "Web development",
  "vulnerability-checker": "Vulnerability check", "software-development": "Software development",
};

export const FOOTER = {
  line: SITE.tagline,
  legal: `© ${SITE.year} M.R.S. (Mohamed Reda Services)`,
  links: [SITE.social.whatsapp, SITE.social.facebook, SITE.social.tiktok],
} as const;

/** Derived: keeps the old export working without a second copy of the data. */
export const PROCESS_STEPS = PROCESS.map(({ title, body }) => ({ title, body }));

/* ======================================================================
   Phase 6: security and vulnerability experience
   ====================================================================== */

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export const SEVERITY_ORDER: readonly Severity[] = ["critical", "high", "medium", "low", "info"];

/** Plain-language scale shown on the security pages. */
export const SEVERITY_LEVELS: readonly { id: Severity; label: string; meaning: string }[] = [
  { id: "critical", label: "Critical", meaning: "Act immediately. Left alone, it could cause serious harm." },
  { id: "high", label: "High", meaning: "Fix soon. A significant weakness that is likely to matter." },
  { id: "medium", label: "Medium", meaning: "Plan a fix. A real weakness, with limited impact or harder to reach." },
  { id: "low", label: "Low", meaning: "Fix when convenient. A minor weakness with small impact." },
  { id: "info", label: "Informational", meaning: "No fix required. A note or a best-practice suggestion." },
];
export const SEVERITY_SCALE_NOTE = "M.R.S. reports use these five levels.";

/** The demo scanner. Every value below is SYNTHETIC. Identifiers use DEMO- on purpose: no real CVE ids. */
export const DEMO = {
  banner: "Demo environment. Results shown for interface demonstration only.",
  inputLabel: "Demo asset",
  defaultAsset: "demo-asset.example",
  inputNote: "Nothing is sent or scanned. Real assessments cover only systems you are authorized to test.",
  inputError: "Enter a demo asset name, for example demo-asset.example.",
  stages: [
    { id: "ready", label: "Ready" }, { id: "scanning", label: "Scanning" },
    { id: "analyzing", label: "Analyzing" }, { id: "complete", label: "Complete" },
  ],
  checks: ["Configuration checks", "Dependency checks", "Access checks", "Response header checks"],
  analyzingText: "Ranking sample findings by severity.",
  completeNote: "Demo complete. Your input was not contacted and no real system was checked.",
  findings: [
    { id: "DEMO-0001", severity: "high", component: "Sample login form",
      description: "Sample finding: sessions do not expire after a period of inactivity.",
      evidence: "Sample evidence: a session token was still accepted after a long idle period (demo value).",
      fix: "Set an inactivity timeout and invalidate tokens on sign-out." },
    { id: "DEMO-0002", severity: "medium", component: "Sample API gateway",
      description: "Sample finding: detailed error messages expose internal structure to clients.",
      evidence: "Sample evidence: an error response contained an internal file path (demo value).",
      fix: "Return generic errors to clients and log the details on the server." },
    { id: "DEMO-0003", severity: "medium", component: "Sample admin panel",
      description: "Sample finding: repeated sign-in attempts are not limited.",
      evidence: "Sample evidence: many failed attempts in a row were all accepted for processing (demo value).",
      fix: "Add rate limiting and a temporary lockout." },
    { id: "DEMO-0004", severity: "low", component: "Sample web server",
      description: "Sample finding: optional security headers are missing from responses.",
      evidence: "Sample evidence: the response header list did not include the recommended entries (demo value).",
      fix: "Add the recommended response headers." },
    { id: "DEMO-0005", severity: "info", component: "Sample dependency list",
      description: "Sample note: a library has a newer stable release available.",
      evidence: "Sample evidence: installed version is behind the latest stable version (demo value).",
      fix: "Schedule a routine update." },
  ] as readonly { id: string; severity: Severity; component: string; description: string; evidence: string; fix: string }[],
} as const;

export const SECURITY_UX = {
  scope: {
    title: "Scope and authorization come first.",
    body: "Security work is only legitimate on systems you own or are allowed to test. So every engagement starts with these four steps, in writing.",
    steps: [
      { name: "Authorization", text: "You confirm that you own the systems, or are authorized to have them tested." },
      { name: "Scope", text: "We list exactly what is in scope: domains, apps, accounts. Anything not listed is not tested." },
      { name: "Method", text: "We agree which kinds of checks run, and when." },
      { name: "Handling", text: "Findings go to you and no one else. See the Privacy Policy." },
    ],
  },
  report: {
    title: "What a report contains.",
    body: "Every report answers the same questions, in the same order, so you can hand it to someone else and they can act on it.",
    caption: "Sample structure only. This is not a real report and contains no real findings.",
    sections: [
      { name: "Summary", text: "Highest severity, number of findings, and what to fix first." },
      { name: "Scope", text: "Exactly which systems were reviewed, and when." },
      { name: "Findings", text: "Each with a severity, the affected component, evidence and a description." },
      { name: "Remediation", text: "A specific fix for every finding, in priority order." },
      { name: "Re-check", text: "Confirmation that the fixes worked." },
    ],
  },
  severity: { title: "How severity is explained.", body: "Five levels, in plain language, so a non-technical reader knows what to do with each one." },
  trust: { title: "Principles we hold ourselves to.", body: "These apply to every security engagement, whatever the size." },
} as const;
