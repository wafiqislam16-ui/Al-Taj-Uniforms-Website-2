import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { COMPANY, CUSTOMISATION_OPTIONS, PRODUCT_BENEFITS, whatsappLink } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Mail, MessageCircle, Phone, Scissors, Palette, Layers, Gem, Type, Pencil, Tag, Check, ImageIcon } from "lucide-react";

type Product = {
  id: string; slug: string; name: string;
  short_description: string | null; description: string | null;
  features: string[] | null; customization_options: string[] | null;
  images: string[] | null; category_id: string | null;
};
type Category = { id: string; slug: string; name: string };

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — Al Taj Uniforms` },
      { name: "description", content: "Premium custom uniform manufacturing by Al Taj Uniforms — request a tailored quote." },
      { property: "og:title", content: `${params.slug} — Al Taj Uniforms` },
      { property: "og:url", content: `/product/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/product/${params.slug}` }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <Layout><section className="max-w-3xl mx-auto px-6 py-32 text-center"><h1 className="text-3xl font-display text-primary">Product not found</h1><Link to="/category" className="mt-6 inline-block text-xs uppercase tracking-widest text-accent">← Back to collections</Link></section></Layout>
  ),
  errorComponent: ({ error, reset }) => (
    <Layout><section className="max-w-3xl mx-auto px-6 py-32 text-center"><h1 className="text-2xl font-display text-primary">Couldn't load this product</h1><button onClick={reset} className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-widest">Try again</button><p className="mt-4 text-xs text-muted-foreground">{error.message}</p></section></Layout>
  ),
});

const CUSTOM_ICONS = [Type, Palette, Layers, Gem, Scissors, Pencil, Tag];

function ProductImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-surface px-8 text-center">
      <ImageIcon className="size-10 text-muted-foreground/50" />
      <div>
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Product Image</span>
        <span className="mt-1 block text-sm font-medium text-primary">{name}</span>
      </div>
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: p } = await supabase
        .from("products").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (!active) return;
      if (!p) { setLoading(false); return; }
      const prod = p as Product;
      setProduct(prod);
      if (prod.category_id) {
        const { data: c } = await supabase.from("categories").select("id, slug, name").eq("id", prod.category_id).maybeSingle();
        if (active) setCategory(c as Category | null);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) return <Layout><div className="px-6 py-32 text-center text-muted-foreground">Loading…</div></Layout>;
  if (!product) throw notFound();

  const gallery = (product.images && product.images.length > 0) ? product.images : [];
  const activeImg = gallery[imgIdx];
  const customWhatsappMsg = `Hello Al Taj Uniforms, I'd like to customise: ${product.name}. Please share more details.`;

  const goPrev = () => setImgIdx((i) => (gallery.length ? (i - 1 + gallery.length) % gallery.length : 0));
  const goNext = () => setImgIdx((i) => (gallery.length ? (i + 1) % gallery.length : 0));

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <nav className="text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/category" className="hover:text-accent">Collections</Link>
          {category && (<>
            <span className="mx-2">/</span>
            <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-accent">{category.name}</Link>
          </>)}
          <span className="mx-2">/</span>
          <span className="text-primary">{product.name}</span>
        </nav>
      </section>

      {/* GALLERY + INFO */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted group">
            {activeImg ? <img src={activeImg} alt={product.name} className="w-full h-full object-cover" /> : <ProductImagePlaceholder name={product.name} />}
            {gallery.length > 1 && (
              <>
                <button onClick={goPrev} aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 size-11 grid place-items-center rounded-full glass hover:scale-105 transition-transform">
                  <ChevronLeft className="size-5" />
                </button>
                <button onClick={goNext} aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 size-11 grid place-items-center rounded-full glass hover:scale-105 transition-transform">
                  <ChevronRight className="size-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                  {imgIdx + 1} / {gallery.length}
                </div>
              </>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {gallery.map((src, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-7">
          {category && <Link to="/category/$slug" params={{ slug: category.slug }} className="eyebrow inline-flex items-center gap-2 hover:opacity-70"><ArrowLeft className="size-3" /> {category.name}</Link>}
          <h1 className="text-4xl md:text-5xl font-display text-primary leading-tight">{product.name}</h1>
          {product.short_description && <p className="text-lg text-muted-foreground font-light leading-relaxed">{product.short_description}</p>}
          {product.description && <p className="text-foreground/80 font-light leading-relaxed">{product.description}</p>}

          {product.features && product.features.length > 0 && (
            <div className="border-t border-primary/10 pt-6">
              <h3 className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Product Features</h3>
              <ul className="space-y-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm font-light">
                    <Check className="size-4 mt-0.5 text-accent shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.customization_options && product.customization_options.length > 0 && (
            <div className="border-t border-primary/10 pt-6">
              <h3 className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Customisation Options</h3>
              <ul className="space-y-2.5">
                {product.customization_options.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm font-light">
                    <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <Link to="/contact-us" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all">
              Request Quote <ArrowRight className="size-4" />
            </Link>
            <a href={whatsappLink(customWhatsappMsg)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-primary/15 hover:bg-surface">
              <MessageCircle className="size-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-surface/60 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="eyebrow">Why Choose Al Taj</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-display text-primary">Manufactured to the highest standard.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PRODUCT_BENEFITS.map((b) => (
              <div key={b.title} className="bg-card border border-primary/5 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-primary">{b.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 font-light leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMISATION GRID */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="eyebrow">Customisation</span>
            <h2 className="mt-2 text-3xl md:text-5xl font-display text-primary leading-tight">Every detail, tailored to your brand.</h2>
            <p className="mt-4 text-muted-foreground font-light">From logo embroidery to fabric selection — every Al Taj uniform is fully customisable.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CUSTOMISATION_OPTIONS.map((c, i) => {
              const Icon = CUSTOM_ICONS[i % CUSTOM_ICONS.length];
              return (
                <div key={c.title} className="glass rounded-2xl p-6 hover:shadow-elevated transition-shadow">
                  <Icon className="size-6 text-accent mb-4" />
                  <h3 className="text-sm font-semibold text-primary">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 font-light leading-relaxed">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 -z-10" />
          <span className="eyebrow text-accent">Get in touch</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-display italic">Want to customise this item?</h2>
          <p className="mt-4 text-primary-foreground/70 font-light max-w-xl mx-auto">
            Our team will guide you through fabric, fit, branding, and bulk options — and send a tailored quote within one business day.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
            <a href={`tel:${COMPANY.phoneRaw}`} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left hover:bg-white/10 transition-colors">
              <Phone className="size-5 text-accent shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary-foreground/60">Phone</p>
                <p className="text-sm font-medium">{COMPANY.phone}</p>
              </div>
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left hover:bg-white/10 transition-colors">
              <Mail className="size-5 text-accent shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary-foreground/60">Email</p>
                <p className="text-sm font-medium break-all">{COMPANY.email}</p>
              </div>
            </a>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={whatsappLink(customWhatsappMsg)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            <Link to="/contact-us" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all">
              Request Quote <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
