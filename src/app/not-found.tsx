import Link from "next/link";

import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <section className="w-full max-w-2xl rounded-3xl border bg-card/80 p-8 text-center shadow-lg backdrop-blur-sm sm:p-12">
        <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-secondary">
          ERROR 404
        </p>

        <h1 className="font-(--font-cormorant) text-5xl leading-tight text-primary sm:text-6xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          The page you are looking for may have been moved, deleted, or the link
          is incorrect.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">Go to Home</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
