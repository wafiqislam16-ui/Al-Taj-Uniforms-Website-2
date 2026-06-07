import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { QuoteForm } from "@/components/site/QuoteForm";
import { COMPANY, whatsappLink } from "@/lib/site-data";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact — Al Taj Uniforms" },
      { name: "description", content: "Get in touch with Al Taj Uniforms — request a quote, call, email, or chat with us on WhatsApp." },
      { property: "og:title", content: "Contact — Al Taj Uniforms" },
      { property: "og:description", content: "Request a quote or speak with our manufacturing team." },
      { property: "og:url", content: "/contact-us" },
    ],
    links: [{ rel: "canonical", href: "/contact-us" }],
  }),
  component: () => (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <span className="eyebrow">Contact</span>
          <h1 className="text-5xl md:text-7xl font-display text-primary leading-[1.05]">Let's <span className="italic">talk.</span></h1>
          <p className="text-muted-foreground font-light max-w-md leading-relaxed">
            Send a message, request a quote, or reach us directly — our manufacturing consultants reply within one business day.
          </p>
          <ul className="space-y-5 pt-4">
            <li className="flex items-center gap-4"><span className="size-11 rounded-full bg-surface grid place-items-center"><Phone className="size-4 text-accent" /></span><a href={`tel:${COMPANY.phoneRaw}`} className="text-sm font-medium text-primary hover:text-accent">{COMPANY.phone}</a></li>
            <li className="flex items-center gap-4"><span className="size-11 rounded-full bg-surface grid place-items-center"><Mail className="size-4 text-accent" /></span><a href={`mailto:${COMPANY.email}`} className="text-sm font-medium text-primary hover:text-accent break-all">{COMPANY.email}</a></li>
            <li className="flex items-center gap-4"><span className="size-11 rounded-full bg-surface grid place-items-center"><MessageCircle className="size-4 text-accent" /></span><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:text-accent">Message on WhatsApp</a></li>
            <li className="flex items-center gap-4"><span className="size-11 rounded-full bg-surface grid place-items-center"><MapPin className="size-4 text-accent" /></span><span className="text-sm font-medium text-primary">{COMPANY.location}</span></li>
          </ul>
          <div className="aspect-video rounded-2xl overflow-hidden border border-primary/10 mt-6">
            <iframe title="Map" src="https://www.google.com/maps?q=Dubai&output=embed" className="w-full h-full" loading="lazy" />
          </div>
        </div>
        <div className="bg-card border border-primary/8 rounded-3xl p-8 md:p-10 shadow-elevated lg:sticky lg:top-28 self-start">
          <h2 className="text-2xl font-display text-primary mb-2">Request a quote</h2>
          <p className="text-sm text-muted-foreground mb-8 font-light">Tell us about your project.</p>
          <QuoteForm />
        </div>
      </section>
    </Layout>
  ),
});
