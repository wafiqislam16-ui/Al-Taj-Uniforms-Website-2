import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { IMAGES } from "@/lib/site-data";
import { useSiteImage } from "@/lib/site-images";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About — Al Taj Uniforms" },
      { name: "description", content: "Premium uniform manufacturing rooted in the UAE — our mission, vision, and capabilities." },
      { property: "og:title", content: "About — Al Taj Uniforms" },
      { property: "og:description", content: "Our story, mission, and manufacturing capabilities." },
      { property: "og:url", content: "/about-us" },
    ],
    links: [{ rel: "canonical", href: "/about-us" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const banner = useSiteImage("about.banner", IMAGES.hero);
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-12">
        <div className="space-y-5">
          <span className="eyebrow">About Al Taj</span>
          <h1 className="text-5xl md:text-7xl font-display text-primary leading-[1.05]">Tailored for the <span className="italic">long term.</span></h1>
        </div>
        <img src={banner} alt="Al Taj Uniforms atelier" loading="lazy" className="w-full aspect-[16/9] object-cover rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-10 pt-6">
          <div className="space-y-3">
            <h3 className="eyebrow">Overview</h3>
            <p className="text-sm leading-relaxed text-muted-foreground font-light">A UAE-based manufacturer producing premium uniforms and branded apparel for businesses, schools, and institutions across the region.</p>
          </div>
          <div className="space-y-3">
            <h3 className="eyebrow">Mission</h3>
            <p className="text-sm leading-relaxed text-muted-foreground font-light">To deliver uniforms that feel as considered as they are durable — uniting craftsmanship, comfort, and brand identity in every garment.</p>
          </div>
          <div className="space-y-3">
            <h3 className="eyebrow">Vision</h3>
            <p className="text-sm leading-relaxed text-muted-foreground font-light">To be the GCC's most trusted partner for organizations that refuse to compromise on how their teams look and feel at work.</p>
          </div>
        </div>
        <div className="bg-surface rounded-3xl p-10 space-y-5">
          <h2 className="text-3xl font-display text-primary">Manufacturing capabilities.</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-primary font-medium">
            {["Custom design & pattern-making","Bulk production at scale","In-house embroidery & printing","Premium fabric sourcing","Quality assurance & finishing","UAE-wide logistics"].map((x) => (
              <li key={x} className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-accent" />{x}</li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}

