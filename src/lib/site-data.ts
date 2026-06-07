import heroAtelier from "@/assets/hero-atelier.jpg";
import catHealthcare from "@/assets/cat-healthcare.jpg";
import catHospitality from "@/assets/cat-hospitality.jpg";
import catConstruction from "@/assets/cat-construction.jpg";
import catSecurity from "@/assets/cat-security.jpg";
import catCorporate from "@/assets/cat-corporate.jpg";
import catIndustrial from "@/assets/cat-industrial.jpg";
import catEducation from "@/assets/cat-education.jpg";
import embroideryDetail from "@/assets/embroidery-detail.jpg";
import schoolsFeature from "@/assets/schools-feature.jpg";

export const COMPANY = {
  name: "Al Taj Uniforms",
  phone: "+971 50 257 0505",
  phoneRaw: "971502570505",
  email: "altajuniforms@gmail.com",
  location: "Dubai, United Arab Emirates",
  whatsappMessage:
    "Hello Al Taj Uniforms, I would like more information about your products and services.",
};

export const whatsappLink = (msg: string = COMPANY.whatsappMessage) =>
  `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(msg)}`;

export const IMAGES = {
  hero: heroAtelier,
  embroidery: embroideryDetail,
  schools: schoolsFeature,
};

export type CategorySlug =
  | "healthcare"
  | "hospitality"
  | "construction"
  | "security"
  | "corporate"
  | "industrial"
  | "education";

export const CATEGORY_IMAGES: Record<string, string> = {
  healthcare: catHealthcare,
  hospitality: catHospitality,
  construction: catConstruction,
  security: catSecurity,
  corporate: catCorporate,
  industrial: catIndustrial,
  education: catEducation,
};

export const FALLBACK_CATEGORIES = [
  { slug: "healthcare",   name: "Healthcare",          description: "Antimicrobial scrubs and clinical wear engineered for hygiene and comfort." },
  { slug: "hospitality",  name: "Hospitality",         description: "Refined uniforms for hotels, restaurants, and luxury resort staff." },
  { slug: "construction", name: "Construction",        description: "Durable high-visibility workwear built for demanding job sites." },
  { slug: "security",     name: "Security",            description: "Tailored security uniforms with professional presence." },
  { slug: "corporate",    name: "Corporate",           description: "Executive shirts, suits, and signature corporate attire." },
  { slug: "industrial",   name: "Industrial",          description: "Heavy-duty protective workwear with reinforced construction." },
  { slug: "education",    name: "Education & Schools", description: "School uniforms, varsity jackets, sportswear, and faculty apparel." },
] as const;

export const INDUSTRIES = [
  { name: "Healthcare",   icon: "Stethoscope" },
  { name: "Hospitality",  icon: "ChefHat" },
  { name: "Construction", icon: "HardHat" },
  { name: "Security",     icon: "Shield" },
  { name: "Corporate",    icon: "Briefcase" },
  { name: "Education",    icon: "GraduationCap" },
  { name: "Government",   icon: "Landmark" },
  { name: "Industrial",   icon: "Factory" },
] as const;

export const WHY_US = [
  { title: "Custom Manufacturing", body: "Garments engineered to your exact spec, palette, and brand." },
  { title: "Bulk Production",      body: "Scale to thousands of units without compromising on finish." },
  { title: "Professional Quality", body: "Premium textiles and atelier-grade construction." },
  { title: "Fast Turnaround",      body: "Streamlined production from approval to dispatch." },
  { title: "Embroidery & Branding",body: "In-house embroidery, printing, and personalization." },
  { title: "UAE-Wide Service",     body: "Dedicated logistics across every emirate." },
] as const;

export const PRODUCT_BENEFITS = [
  { title: "High Quality Materials", body: "Premium fabrics sourced from trusted mills, finished to atelier standard." },
  { title: "Custom Branding",        body: "In-house embroidery, printing, and personalized branding on every piece." },
  { title: "Bulk Manufacturing",     body: "Scale from a single team to thousands of units with consistent quality." },
  { title: "Fast Turnaround",        body: "Streamlined production from approval to dispatch — typically 2–4 weeks." },
  { title: "UAE Production",         body: "Manufactured locally in the UAE — full quality oversight and faster delivery." },
] as const;

export const CUSTOMISATION_OPTIONS = [
  { title: "Logo Embroidery",   body: "Crisp, durable embroidery on chest, sleeve, or back panels." },
  { title: "Colour Options",    body: "Match your brand palette exactly — Pantone-accurate dyeing available." },
  { title: "Fabric Options",    body: "Choose from cotton, polycotton, performance blends, and technical fabrics." },
  { title: "Premium Materials", body: "Leather trims, brass hardware, and elevated finishing details." },
  { title: "Stitching Details", body: "Contrast stitching, reinforced seams, and bespoke construction." },
  { title: "Design Customisation", body: "Cuts, silhouettes, and detailing tailored to your brief." },
  { title: "Additional Branding", body: "Woven labels, hang tags, and printed care labels." },
] as const;

export const FALLBACK_TESTIMONIALS = [
  { author_name: "Sara Al-Mansoori", company: "Regent International School", quote: "The varsity jackets exceeded our expectations. Embroidery is museum-grade and the fit is impeccable across every size." },
  { author_name: "Daniel Hage",     company: "Burj Hospitality Group",      quote: "Our concierge team has never looked sharper. Al Taj delivered five-star tailoring at every level of service." },
  { author_name: "Mariam Khalil",   company: "Emirates Health Network",     quote: "Antimicrobial scrubs that actually feel premium. Our clinicians notice the difference every single shift." },
] as const;
