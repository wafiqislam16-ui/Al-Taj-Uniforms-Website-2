import { Link } from "@tanstack/react-router";
import { COMPANY, whatsappLink } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="bg-surface pt-20 pb-10 px-6 border-t border-primary/5 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-primary/10 pb-16">
          <div className="md:col-span-2 space-y-5">
            <div className="font-sans font-semibold tracking-tight text-primary text-lg">
              Al Taj <span className="font-light text-primary/70">Uniforms</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-light">
              Precision uniform manufacturing for the world's most demanding professional environments — based in the UAE, trusted across the region.
            </p>
            <div className="aspect-[16/8] max-w-sm rounded-xl overflow-hidden border border-primary/10 bg-muted">
              <iframe
                title="Al Taj Uniforms location"
                src="https://www.google.com/maps?q=Dubai&output=embed"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-primary">Solutions</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-light">
              <li><Link to="/category/$slug" params={{ slug: "corporate" }} className="hover:text-accent">Corporate</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "healthcare" }} className="hover:text-accent">Healthcare</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "hospitality" }} className="hover:text-accent">Hospitality</Link></li>
              <li><Link to="/schools-institutions" className="hover:text-accent">Schools</Link></li>
              <li><Link to="/embroidery-branding" className="hover:text-accent">Embroidery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-primary">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-light">
              <li><a href={`tel:${COMPANY.phoneRaw}`} className="hover:text-accent">{COMPANY.phone}</a></li>
              <li><a href={`mailto:${COMPANY.email}`} className="hover:text-accent break-all">{COMPANY.email}</a></li>
              <li>{COMPANY.location}</li>
              <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-accent">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] text-muted-foreground uppercase tracking-widest">
            <Link to="/about-us" className="hover:text-accent">About</Link>
            <Link to="/contact-us" className="hover:text-accent">Contact</Link>
            <Link to="/admin" className="hover:text-accent">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
