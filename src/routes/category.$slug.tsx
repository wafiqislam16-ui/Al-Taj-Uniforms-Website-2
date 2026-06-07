import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { CATEGORY_IMAGES, whatsappLink } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ImageIcon } from "lucide-react";

type Category = { id: string; slug: string; name: string; description: string | null; image_url: string | null };
type Product = { id: string; slug: string; name: string; short_description: string | null; images: string[] | null };

function ProductImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <ImageIcon className="size-9 text-muted-foreground/50" />
      <div>
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Product Image</span>
        <span className="mt-1 block text-xs font-medium text-primary">{name}</span>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const niceName = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${niceName} Uniforms — Al Taj Uniforms` },
        { name: "description", content: `${niceName} uniforms by Al Taj Uniforms — custom manufacturing, embroidery, and bulk production in the UAE.` },
        { property: "og:title", content: `${niceName} Uniforms — Al Taj Uniforms` },
        { property: "og:url", content: `/category/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const [cat, setCat] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const { data: c } = await supabase
        .from("categories").select("*").eq("slug", slug).maybeSingle();
      if (!active) return;
      if (!c) { setNotFound(true); setLoading(false); return; }
      const cat = c as Category;
      setCat(cat);
      const { data } = await supabase
        .from("products")
        .select("id, slug, name, short_description, images")
        .eq("category_id", cat.id)
        .eq("is_published", true)
        .order("sort_order");
      if (active) { setProducts((data as Product[]) ?? []); setLoading(false); }
    })();
    return () => { active = false; };
  }, [slug]);

  if (notFoundState) {
    return <Layout><section className="max-w-3xl mx-auto px-6 py-32 text-center">
      <h1 className="text-3xl font-display text-primary">Category not found</h1>
      <Link to="/category" className="mt-6 inline-block text-xs uppercase tracking-widest text-accent">← Back to collections</Link>
    </section></Layout>;
  }

  const image = cat ? (cat.image_url || (cat.slug in CATEGORY_IMAGES ? CATEGORY_IMAGES[cat.slug] : undefined)) : undefined;

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[380px] -mt-24 pt-24 flex items-end px-6 overflow-hidden">
        {image && <img src={image} alt={`${cat?.name ?? "Category"} uniforms`} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="relative z-10 max-w-7xl mx-auto w-full pb-14">
          <nav className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            <Link to="/" className="hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/category" className="hover:text-accent">Collections</Link>
            {cat && <><span className="mx-2">/</span><span className="text-primary">{cat.name}</span></>}
          </nav>
          <span className="eyebrow">Collection</span>
          <h1 className="mt-3 text-5xl md:text-7xl font-display text-primary">{cat?.name ?? "…"}</h1>
          {cat?.description && <p className="mt-4 max-w-xl text-muted-foreground font-light">{cat.description}</p>}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="text-center text-muted-foreground text-sm py-16">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center space-y-5">
            <h2 className="text-3xl font-display text-primary">A custom catalogue is on the way.</h2>
            <p className="text-muted-foreground max-w-lg mx-auto font-light">
              Our manufacturing team is curating samples for this collection. Tell us about your project and we'll send a tailored lookbook within one business day.
            </p>
            <Link to="/contact-us" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all">
              Request a Quote <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <span className="eyebrow">{products.length} {products.length === 1 ? "Product" : "Products"}</span>
                <h2 className="mt-2 text-3xl md:text-4xl font-display text-primary">Browse the {cat?.name.toLowerCase()} range.</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const cover = p.images?.[0];
                return (
                  <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="group block rounded-3xl overflow-hidden bg-card border border-primary/5 hover:shadow-elevated transition-all">
                    <div className="aspect-[4/5] overflow-hidden bg-muted">
                      {cover ? <img src={cover} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" /> : <ProductImagePlaceholder name={p.name} />}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-primary">{p.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5 font-light line-clamp-2">{p.short_description}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
                        View Product <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="glass rounded-3xl p-10 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="eyebrow">Bespoke Programme</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-display text-primary">Don't see exactly what you need?</h2>
            <p className="mt-3 text-muted-foreground font-light max-w-md">
              Every uniform is made to your specification. Tell us your requirements and we'll send a tailored proposal.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to="/contact-us" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all">
              Request Quote <ArrowRight className="size-4" />
            </Link>
            <a href={whatsappLink(`Hi Al Taj Uniforms, I'd like to discuss ${cat?.name ?? "uniform"} options.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-primary/15 hover:bg-surface">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
