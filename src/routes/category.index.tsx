import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { CATEGORY_IMAGES, FALLBACK_CATEGORIES } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";

type CategoryCard = { slug: string; name: string; description: string; image: string };

export const Route = createFileRoute("/category/")({
  head: () => ({
    meta: [
      { title: "Collections — Al Taj Uniforms" },
      { name: "description", content: "Explore uniform collections by sector: healthcare, hospitality, construction, security, corporate, industrial, and education." },
      { property: "og:title", content: "Collections — Al Taj Uniforms" },
      { property: "og:description", content: "Browse uniform collections by industry." },
      { property: "og:url", content: "/category" },
    ],
    links: [{ rel: "canonical", href: "/category" }],
  }),
  component: CategoriesIndex,
});

function CategoriesIndex() {
  const [categories, setCategories] = useState<CategoryCard[]>(
    FALLBACK_CATEGORIES.map((category) => ({
      ...category,
      image: CATEGORY_IMAGES[category.slug],
    })),
  );

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
            image: category.image_url ?? CATEGORY_IMAGES[category.slug] ?? CATEGORY_IMAGES.healthcare,
          };
        }));
      });
    return () => { active = false; };
  }, []);

  return (
    <Layout>
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <span className="eyebrow">Collections</span>
        <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">Browse by sector.</h1>
        <p className="mt-4 text-muted-foreground max-w-xl font-light">
          Every category is designed and manufactured in-house to the same atelier standard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {categories.map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group block rounded-3xl overflow-hidden h-[420px] relative">
              <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 glass-dark rounded-2xl p-5">
                <h3 className="text-white text-lg font-medium">{c.name}</h3>
                <p className="text-white/70 text-sm mt-1 font-light line-clamp-2">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
