import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useMatches,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useEffect } from "react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-primary/10 bg-background px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function DocumentHead() {
  const matches = useMatches();
  useEffect(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const opts = (matches[i] as unknown as { staticData?: unknown; routeContext?: unknown; __routeContext?: unknown; loaderData?: unknown; context?: unknown });
      const head = (matches[i] as any).meta as Array<{ title?: string; name?: string; content?: string }> | undefined;
      const route = (matches[i] as any).route ?? matches[i];
      const headFn = (route as any)?.options?.head;
      const headResult = typeof headFn === "function" ? headFn({ params: (matches[i] as any).params, loaderData: (matches[i] as any).loaderData }) : undefined;
      const metaList = head ?? headResult?.meta;
      if (Array.isArray(metaList)) {
        const titleEntry = metaList.find((m) => m && typeof m === "object" && "title" in m && (m as any).title);
        if (titleEntry?.title) {
          document.title = (titleEntry as any).title;
          return;
        }
      }
      void opts;
    }
  }, [matches]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentHead />
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
