import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroAtelier from "@/assets/hero-atelier.jpg";
import schoolsFeature from "@/assets/schools-feature.jpg";
import embroideryDetail from "@/assets/embroidery-detail.jpg";
import catCorporate from "@/assets/cat-corporate.jpg";

export type HeroSlide = {
  id: string;
  headline: string;
  subheadline: string | null;
  image_url: string;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
};

// Map seeded /src/assets/... paths to bundled URLs
const SEED_MAP: Record<string, string> = {
  "/src/assets/hero-atelier.jpg": heroAtelier,
  "/src/assets/schools-feature.jpg": schoolsFeature,
  "/src/assets/embroidery-detail.jpg": embroideryDetail,
  "/src/assets/cat-corporate.jpg": catCorporate,
};
const resolveImg = (url: string) => SEED_MAP[url] ?? url;

const FALLBACK: HeroSlide[] = [
  {
    id: "f1",
    headline: "Custom Uniform Manufacturing",
    subheadline: "Premium garments engineered to your exact specification — designed and produced in the UAE.",
    image_url: heroAtelier,
    primary_cta_label: "Request a Quote",
    primary_cta_href: "/contact-us",
    secondary_cta_label: "View Collections",
    secondary_cta_href: "/category",
  },
];

function CTA({ href, label, primary }: { href: string; label: string; primary: boolean }) {
  const cls = primary
    ? "inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all"
    : "inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest glass text-primary hover:bg-white transition-all";
  return <a href={href} className={cls}>{label} {primary && <ArrowRight className="size-4" />}</a>;
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK);
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    supabase
      .from("hero_slides")
      .select("*")
      .eq("is_published", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length) setSlides(data as HeroSlide[]);
      });
  }, []);

  useEffect(() => {
    if (!embla) return;
    const onSel = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSel);
    onSel();
    return () => { embla.off("select", onSel); };
  }, [embla, slides.length]);

  return (
    <section className="relative -mt-24 pt-24">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div key={s.id} className="relative flex-[0_0_100%] min-w-0 h-[88vh] min-h-[600px]">
              <img src={resolveImg(s.image_url)} alt={s.headline} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />
              <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
                <div className="max-w-2xl space-y-7 animate-fade-up">
                  <span className="eyebrow">Premium UAE Manufacturing</span>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-display leading-[0.95] text-primary text-balance">
                    {s.headline}
                  </h1>
                  {s.subheadline && (
                    <p className="text-lg text-foreground/80 leading-relaxed font-light max-w-xl">
                      {s.subheadline}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    {s.primary_cta_label && s.primary_cta_href && (
                      <CTA href={s.primary_cta_href} label={s.primary_cta_label} primary />
                    )}
                    {s.secondary_cta_label && s.secondary_cta_href && (
                      <CTA href={s.secondary_cta_href} label={s.secondary_cta_label} primary={false} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => embla?.scrollPrev()}
            className="hidden md:grid absolute left-6 top-1/2 -translate-y-1/2 size-12 place-items-center rounded-full glass text-primary hover:bg-white transition"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => embla?.scrollNext()}
            className="hidden md:grid absolute right-6 top-1/2 -translate-y-1/2 size-12 place-items-center rounded-full glass text-primary hover:bg-white transition"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => embla?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === selected ? "w-10 bg-primary" : "w-5 bg-primary/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
