"use client";
import Link from "next/link";
import Image from "next/image";
import { Flower, Sparkle } from "@/components/visuals/Ornaments";
import { useId, useRef, useState } from "react";
import { Button } from "./Button";
import { PAGES, SITE } from "@/lib/constants/content";
import { cn } from "@/lib/utils/cn";

type Values = { name: string; email: string; service: string; message: string; budget: string; timeline: string };
type Errors = Partial<Record<"name" | "email" | "message", string>>;
const F = PAGES.contact;

const input = "min-h-11 w-full rounded-sm border bg-bg px-3 text-ink placeholder:text-ink-muted transition-[border-color,box-shadow] duration-fast focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_rgb(var(--accent)/0.2)] focus-visible:outline-none";

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = F.errors.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = F.errors.email;
  if (v.message.trim().length < 10) e.message = F.errors.message;
  return e;
}

/** `defaultService` comes from `?service=` (read in the server page and passed down). */
export function ContactForm({ defaultService = "" }: { defaultService?: string }) {
  const uid = useId();
  const [values, setValues] = useState<Values>({ name: "", email: "", service: defaultService, message: "", budget: "", timeline: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (k in errors) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = (["name", "email", "message"] as const).find((k) => found[k]);
    if (first) { form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    // INTEGRATION POINT: send `values` to your email/API service here (server action or route handler).
    // Until one is configured, nothing is sent, and the success state below says so.
    setDone(true);
  }

  if (done) {
    return (
      <div role="status" className="relative isolate overflow-hidden rounded-lg border border-line bg-surface-1 p-6 sm:p-10 sm:pr-52">
        {/* Thank-you card in the owner's canvas style: bold shapes bleed off the corner, the signature signs off. Wide screens only, so they never sit under text. */}
        <Flower className="-right-10 -top-10 -z-10 hidden h-44 w-44 sm:block" />
        <Sparkle className="bottom-6 right-44 -z-10 hidden h-7 w-7 sm:block" />
        <Image src="/brand/mrs-signature.png" alt="M.R.S. signature" width={594} height={234} className="absolute bottom-5 right-6 hidden h-auto w-36 sm:block" />
        <h2 className="font-display text-2xl font-semibold">Details received on this page only.</h2>
        <p className="mt-3 max-w-prose text-ink-2">{F.demoSuccess}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={SITE.social.whatsapp.href} chevron>Message on WhatsApp</Button>
          <Button href={`mailto:${SITE.contactEmail}`} variant="secondary">Email us</Button>
          <Button variant="ghost" onClick={() => setDone(false)}>Edit details</Button>
        </div>
      </div>
    );
  }

  const field = (k: "name" | "email" | "message") => ({
    id: `${uid}-${k}`, name: k, value: values[k], onChange: set(k), "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined, className: cn(input, errors[k] ? "border-danger" : "border-line-control"),
  });
  const Err = ({ k }: { k: keyof Errors }) => errors[k] ? <p id={`${uid}-${k}-err`} className="mt-1.5 text-sm text-danger">{errors[k]}</p> : null;
  const label = "mb-2 block text-sm text-ink-2";

  return (
    <form ref={form} onSubmit={submit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div><label htmlFor={`${uid}-name`} className={label}>{F.fields.name}</label><input {...field("name")} autoComplete="name" /><Err k="name" /></div>
        <div><label htmlFor={`${uid}-email`} className={label}>{F.fields.email}</label><input {...field("email")} type="email" autoComplete="email" inputMode="email" placeholder="name@example.com" /><Err k="email" /></div>
      </div>
      <div><label htmlFor={`${uid}-service`} className={label}>{F.fields.service}</label>
        <select id={`${uid}-service`} value={values.service} onChange={set("service")} className={cn(input, "border-line-control")}>
          <option value="">Select one</option>{F.serviceOptions.map((o) => <option key={o}>{o}</option>)}
        </select></div>
      <div><label htmlFor={`${uid}-message`} className={label}>{F.fields.message}</label><textarea {...field("message")} rows={6} className={cn(field("message").className, "py-3")} /><Err k="message" /></div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div><label htmlFor={`${uid}-budget`} className={label}>{F.fields.budget}</label><input id={`${uid}-budget`} value={values.budget} onChange={set("budget")} className={cn(input, "border-line-control")} /></div>
        <div><label htmlFor={`${uid}-timeline`} className={label}>{F.fields.timeline}</label><input id={`${uid}-timeline`} value={values.timeline} onChange={set("timeline")} className={cn(input, "border-line-control")} /></div>
      </div>
      <Button type="submit" size="lg" chevron>{F.submit}</Button>
      <p className="text-sm text-ink-muted">{F.alt}{" "}<Link href="/privacy" className="text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">{F.privacyLink}</Link></p>
    </form>
  );
}
