import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { QuoteForm } from "@/components/site/QuoteForm";
import { IMAGES } from "@/lib/site-data";
import { useSiteImage } from "@/lib/site-images";

export const Route = createFileRoute("/schools-institutions")({
  head: () => ({
    meta: [
      { title: "School Uniforms & Varsity Jackets — Al Taj Uniforms" },
      { name: "description", content: "Custom school uniforms, varsity jackets, sportswear, and faculty apparel for educational institutions across the UAE." },
      { property: "og:title", content: "School Uniforms & Varsity Jackets — Al Taj Uniforms" },
      { property: "og:description", content: "Bespoke manufacturing for schools and universities." },
      { property: "og:url", content: "/schools-institutions" },
    ],
    links: [{ rel: "canonical", href: "/schools-institutions" }],
  }),
  component: SchoolsPage,
});

function SchoolsPage() {
  const banner = useSiteImage("schools.banner", IMAGES.schools);
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <span className="eyebrow">Schools & Institutions</span>
          <h1 className="text-5xl md:text-7xl font-display text-primary leading-[1.05]">Apparel that builds <span className="italic">identity.</span></h1>
          <p className="text-muted-foreground font-light leading-relaxed">
            We manufacture high-durability apparel for the daily demands of student life —
            tailored uniforms, varsity jackets, sportswear, faculty wear, and custom branded clothing.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 pt-4">
            {["School Uniforms","Varsity Jackets","Performance Sportswear","Faculty & Staff Apparel","Custom School Clothing","Bulk Production"].map((x) => (
              <li key={x} className="flex items-center gap-3 text-sm font-medium text-primary"><span className="size-1.5 rounded-full bg-accent" />{x}</li>
            ))}
          </ul>
          <img src={banner} alt="Varsity jackets and school apparel" loading="lazy" className="mt-8 rounded-3xl aspect-[5/4] object-cover w-full" />
        </div>
        <div className="lg:sticky lg:top-28 bg-card border border-primary/8 rounded-3xl p-8 md:p-10 shadow-elevated">
          <h2 className="text-2xl font-display text-primary mb-2">Request a School Uniform Quote</h2>
          <p className="text-sm text-muted-foreground mb-8 font-light">Tell us about your institution and requirements.</p>
          <QuoteForm />
        </div>
      </section>
    </Layout>
  );
}

