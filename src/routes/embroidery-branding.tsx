import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { IMAGES } from "@/lib/site-data";
import { useSiteImage } from "@/lib/site-images";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/embroidery-branding")({
  head: () => ({
    meta: [
      { title: "Custom Embroidery & Branding — Al Taj Uniforms" },
      { name: "description", content: "Logo embroidery, name embroidery, corporate branding, and uniform personalization services in the UAE." },
      { property: "og:title", content: "Custom Embroidery & Branding — Al Taj Uniforms" },
      { property: "og:description", content: "Premium embroidery and branding services." },
      { property: "og:url", content: "/embroidery-branding" },
    ],
    links: [{ rel: "canonical", href: "/embroidery-branding" }],
  }),
  component: EmbroideryPage,
});

function EmbroideryPage() {
  const banner = useSiteImage("embroidery.banner", IMAGES.embroidery);
  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-24 px-6 -mt-24 pt-44">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="eyebrow text-accent">Embroidery & Branding</span>
            <h1 className="text-5xl md:text-7xl font-display italic leading-[1]">Precision branding.</h1>
            <p className="text-white/70 font-light leading-relaxed max-w-md">
              Logo embroidery, name personalization, and corporate branding — executed in-house
              with archival-grade thread and museum-grade stitching.
            </p>
            <Link to="/contact-us" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition-all">
              Start a project <ArrowRight className="size-4" />
            </Link>
          </div>
          <img src={banner} alt="Gold thread embroidery detail" className="rounded-3xl aspect-square object-cover w-full" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { t: "Logo Embroidery", d: "High-thread-count execution with brand-true color matching." },
            { t: "Name Embroidery", d: "Crisp personalization across uniforms and staff apparel." },
            { t: "Corporate Branding", d: "Cohesive identity systems applied to every garment." },
            { t: "Uniform Personalization", d: "Sizes, positions, and finishes tuned to each role." },
            { t: "Custom Apparel Branding", d: "From caps to outerwear, perfectly on-brand." },
            { t: "3D & Chenille Patches", d: "Standout finishes for varsity and athletic apparel." },
          ].map((x) => (
            <div key={x.t} className="bg-card border border-primary/8 rounded-2xl p-7 space-y-3">
              <h3 className="font-display text-2xl text-primary">{x.t}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
