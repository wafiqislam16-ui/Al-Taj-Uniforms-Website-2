CREATE TABLE public.hero_slides (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  headline text NOT NULL,
  subheadline text,
  image_url text NOT NULL,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read hero slides" ON public.hero_slides
  FOR SELECT TO anon, authenticated
  USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins manage hero slides" ON public.hero_slides
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
