import { createFileRoute, redirect } from "@tanstack/react-router";

// Aliases "/en" to the canonical "/en/" home so both URLs work consistently.
export const Route = createFileRoute("/en")({
  beforeLoad: () => {
    throw redirect({ to: "/en/" as any, replace: true });
  },
});
