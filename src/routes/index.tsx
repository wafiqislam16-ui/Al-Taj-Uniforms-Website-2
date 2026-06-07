import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Truck, Factory, Award, Clock, MapPin, Stethoscope, ChefHat, HardHat, Shield, Briefcase, GraduationCap, Landmark } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { QuoteForm } from "@/components/site/QuoteForm";
import { CATEGORY_IMAGES, FALLBACK_CATEGORIES, FALLBACK_TESTIMONIALS, IMAGES, INDUSTRIES, WHY_US, whatsappLink } from "@/lib/site-data";
import { useSiteImage } from "@/lib/site-images";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Al Taj Uniforms — Custom Uniform Manufacturing in the UAE" },
      { name: "description", content: "Professional uniform manufacturing, embroidery, branding, and bulk production for businesses, schools, and organizations across the UAE." },
      { property: "og:title", content: "Al Taj Uniforms — Custom Uniform Manufacturing" },
      { property: "og:description", content: "Custom uniforms, embroidery, and bulk production tailored to your organization." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope, ChefHat, HardHat, Shield, Briefcase, GraduationCap, Landmark, Factory,
};
const WHY_ICONS = [Sparkles, Factory, Award, Clock, Truck, MapPin];
type CategoryCard = { slug: string; name: string; description: string; image: string };

const fallbackCategoryCards: CategoryCard[] = FALLBACK_CATEGORIES.map((category) => ({
  ...category,
  image: CATEGORY_IMAGES[category.slug],
}));

function HomePage() {
  const schoolsImg = useSiteImage("home.schools", IMAGES.schools);
  const embroideryImg = useSiteImage("home.embroidery", IMAGES.embroidery);
  const [categories, setCategories] = useState<CategoryCard[]>(fallbackCategoryCards);

  useEffect(() => {
    let active = true;
    supabase
      .from("categories")
      .select("slug, name, description, image_url")
      .order("sort_order")
      .then(({ data }) => {
        if (!active || !data?.length) return;
        setCategories(data.map((category) => {
          const fallback = FALLBACK_CATEGORIES.find((item) => item.slug === category.slug);
          return {
            slug: category.slug,
            name: category.name,
            description: category.description ?? fallback?.description ?? "Custom uniform manufacturing for your organization.",
            image: category.image_url ?? CATEGORY_IMAGES[category.slug] ?? IMAGES.hero,
          };
        }));
      });
    return () => { active = false; };
  }, []);

  return (
    <Layout>
      <HeroCarousel />

      {/* CATEGORIES */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-16">
            <div className="space-y-3">
              <span className="eyebrow">01 — Collections</span>
              <h2 className="text-4xl md:text-5xl font-display text-primary">Tailored by sector.</h2>
            </div>
            <Link to="/category" className="text-xs uppercase tracking-widest border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors">
              View all categories
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative h-[460px] overflow-hidden rounded-3xl block"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <div className="glass-dark rounded-2xl p-5">
                    <h3 className="text-white text-lg font-medium">{c.name}</h3>
                    <p className="text-white/70 text-sm mt-1.5 font-light line-clamp-2">{c.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 px-6 bg-surface/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 space-y-3 max-w-2xl">
            <span className="eyebrow">02 — Industries we serve</span>
            <h2 className="text-3xl md:text-4xl font-display text-primary">A partner across every professional environment.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {INDUSTRIES.map((i) => {
              const Icon = ICONS[i.icon];
              return (
                <div key={i.name} className="group bg-card border border-primary/5 rounded-2xl p-6 flex flex-col items-start gap-4 hover:border-accent/30 hover:shadow-glass transition-all">
                  {Icon && <Icon className="size-7 text-accent" />}
                  <span className="text-sm font-semibold text-primary">{i.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCHOOLS FEATURE */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <img src={schoolsImg} alt="Premium school varsity jackets" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-3xl" />
            <div className="hidden md:block absolute -bottom-8 -right-8 max-w-xs glass rounded-2xl p-6">
              <p className="text-sm italic font-display text-primary leading-snug">
                "The varsity jackets exceeded our expectations. Museum-grade embroidery."
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-widest text-accent font-semibold">
                Regent International School
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-7">
            <span className="eyebrow">03 — Schools & Institutions</span>
            <h2 className="text-4xl md:text-6xl font-display text-primary leading-[1.05]">
              Defining institutional <span className="italic">identity.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light max-w-md">
              We partner with elite schools and educational institutions to manufacture apparel
              that fosters pride and community — from classic tailored uniforms to varsity
              jackets, sportswear, and faculty apparel.
            </p>
            <ul className="space-y-3">
              {["School Uniforms","Varsity Jackets","Performance Sportswear","Faculty & Staff Apparel","Custom School Branding"].map((x) => (
                <li key={x} className="flex items-center gap-3 text-sm text-primary font-medium">
                  <span className="size-1.5 rounded-full bg-accent" /> {x}
                </li>
              ))}
            </ul>
            <Link
              to="/schools-institutions"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary border-b-2 border-accent/50 pb-1 hover:border-accent transition-colors"
            >
              Request a School Uniform Quote <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* EMBROIDERY / BRANDING */}
      <section className="bg-primary text-primary-foreground py-28 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8">
            <span className="eyebrow text-accent">04 — Embroidery & Branding</span>
            <h2 className="text-5xl md:text-7xl font-display italic leading-[1]">Precision branding.</h2>
            <p className="text-white/65 text-lg leading-relaxed font-light max-w-md">
              From intricate logo embroidery to high-durability heat transfers, your brand
              identity is reflected with absolute clarity on every garment.
            </p>
            <ul className="space-y-4 text-sm tracking-widest uppercase text-white/80">
              {["High-Thread Count Logo Embroidery","Name Embroidery & Personalization","Corporate Apparel Branding","Custom Dye-Sublimation","3D Silicone & Chenille Patches"].map((x) => (
                <li key={x} className="flex items-center gap-4">
                  <span className="size-1 bg-accent rounded-full" /> {x}
                </li>
              ))}
            </ul>
            <Link to="/embroidery-branding" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent border-b border-accent/40 pb-1 hover:text-white hover:border-white transition-colors">
              Explore techniques <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-full border border-white/10 p-8">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={embroideryImg} alt="Gold thread embroidery detail" loading="lazy" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute top-1/2 -left-4 md:-left-12 max-w-xs glass-dark rounded-3xl p-6">
              <span className="text-[10px] text-accent font-semibold tracking-widest uppercase">Premium Finish</span>
              <p className="text-sm text-white/85 mt-2 font-light leading-relaxed">
                Over 2.5 million stitches delivered every month to corporate partners across the region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-3 max-w-2xl">
            <span className="eyebrow">05 — Why Al Taj</span>
            <h2 className="text-4xl md:text-5xl font-display text-primary">Built for organizations that don't compromise.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-primary/8 rounded-3xl overflow-hidden border border-primary/8">
            {WHY_US.map((w, i) => {
              const Icon = WHY_ICONS[i];
              return (
                <div key={w.title} className="bg-background p-8 space-y-4 hover:bg-surface transition-colors">
                  <Icon className="size-6 text-accent" />
                  <h3 className="text-lg font-semibold text-primary">{w.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{w.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 bg-surface/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 space-y-3 max-w-2xl">
            <span className="eyebrow">06 — Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-display text-primary">Trusted by leaders across the region.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FALLBACK_TESTIMONIALS.map((t) => (
              <div key={t.author_name} className="glass rounded-3xl p-8 space-y-6">
                <div className="text-4xl font-display text-accent leading-none">"</div>
                <p className="text-base text-primary leading-relaxed font-light">{t.quote}</p>
                <div className="pt-4 border-t border-primary/10">
                  <p className="text-sm font-semibold text-primary">{t.author_name}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE FORM */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto bg-card border border-primary/8 rounded-3xl p-10 md:p-16 shadow-elevated">
          <div className="text-center space-y-4 mb-12">
            <span className="eyebrow">07 — Start a project</span>
            <h2 className="text-3xl md:text-5xl font-display italic text-primary">Begin your partnership.</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto font-light">
              Submit your requirements and our manufacturing consultants will be in touch within one business day.
            </p>
          </div>
          <QuoteForm />
          <p className="text-center text-xs text-muted-foreground mt-8">
            Prefer to talk? <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">Message us on WhatsApp</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
