import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
