"use client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PAGES } from "@/lib/constants/content";

/**
 * Route-level error boundary. Deliberately shows no error details to visitors (they can leak internals);
 * `error.digest` is what to look for in the server logs.
 */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const e = PAGES.error;
  return (
    <Container className="pb-32 pt-40">
      <h1 className="font-display text-display-lg font-semibold text-balance">{e.title}</h1>
      <p className="mt-5 max-w-prose text-lg text-ink-2">{e.body}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button onClick={reset} size="lg">{e.retry}</Button>
        <Button href="/" size="lg" variant="secondary">{e.home}</Button>
      </div>
    </Container>
  );
}
