import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CommercialAIChat } from "@/components/site/CommercialAIChat";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="public-site flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <CommercialAIChat />
      <Toaster />
    </div>
  );
}
