import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { COMPANY } from "@/lib/site-data";

const links = [
  { to: "/category" as const, label: "Collections" },
  { to: "/schools-institutions" as const, label: "Schools" },
  { to: "/embroidery-branding" as const, label: "Embroidery" },
  { to: "/about-us" as const, label: "About" },
  { to: "/contact-us" as const, label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <nav className="fixed top-0 inset-x-0 z-40 px-4 sm:px-6 pt-4">
      <div
        className={`max-w-7xl mx-auto rounded-2xl border border-white/55 shadow-glass backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ${
          scrolled ? "bg-white/80" : "bg-white/55"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 sm:px-6">
          <Link to="/" className="font-sans font-semibold tracking-tight text-primary text-base sm:text-lg">
            Al Taj <span className="font-light text-primary/70">Uniforms</span>
          </Link>


          <div className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide uppercase">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-accent" }}
                className="text-primary/80 hover:text-accent transition-colors text-xs"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/contact-us"
              className="hidden sm:inline-flex bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Get a Quote
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden size-10 grid place-items-center rounded-full bg-white/60 border border-white/60"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-primary/5 px-5 py-5 space-y-3 animate-fade-in">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-sm font-medium tracking-wide uppercase text-primary/80 hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact-us"
              className="block w-full text-center bg-primary text-primary-foreground px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-widest"
            >
              Get a Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
