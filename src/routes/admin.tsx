import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { IMAGE_SLOTS, useAllSiteImages, saveSiteImages } from "@/lib/site-images";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Al Taj Uniforms" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Category = { id: string; slug: string; name: string; description: string | null; image_url: string | null; sort_order: number };
type Product = {
  id: string; slug: string; name: string;
  short_description: string | null; description: string | null;
  features: string[] | null; customization_options: string[] | null;
  images: string[] | null; category_id: string | null;
  is_published: boolean; sort_order: number;
};
type Portfolio = { id: string; title: string; category: string; description: string | null; image_url: string; sort_order: number };
type Testimonial = { id: string; author_name: string; author_role: string | null; company: string | null; quote: string; rating: number | null; sort_order: number };
type Quote = { id: string; name: string; company: string | null; email: string; phone: string | null; industry: string | null; quantity: string | null; message: string | null; status: string; created_at: string };
type SiteContent = { key: string; value: Record<string, unknown> };
type HeroSlide = { id: string; headline: string; subheadline: string | null; image_url: string; primary_cta_label: string | null; primary_cta_href: string | null; secondary_cta_label: string | null; secondary_cta_href: string | null; is_published: boolean; sort_order: number };

function AdminPage() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
      setIsAdmin((data ?? []).some((r) => r.role === "admin"));
    });
  }, [session]);

  if (loading) return <Layout><div className="px-6 py-24 text-center text-muted-foreground">Loading…</div></Layout>;
  if (!session) return <Layout><AuthForm /></Layout>;

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="text-4xl font-display text-primary mt-2">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">{session.user.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">Sign out</button>
        </div>

        {!isAdmin ? (
          <div className="bg-surface rounded-2xl p-10 text-center text-muted-foreground text-sm">
            Your account doesn't have admin access yet. Ask your developer to run this in the database:
            <pre className="mt-4 text-left text-xs bg-primary text-primary-foreground p-4 rounded-lg overflow-auto">{`INSERT INTO public.user_roles (user_id, role)\nVALUES ('${session.user.id}', 'admin');`}</pre>
          </div>
        ) : (
          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-8 mb-8 h-auto">
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="hero">Hero Slides</TabsTrigger>
              <TabsTrigger value="images">Website Images</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <TabsContent value="quotes"><QuotesPanel /></TabsContent>
            <TabsContent value="hero"><HeroSlidesPanel /></TabsContent>
            <TabsContent value="images"><SiteImagesPanel /></TabsContent>
            <TabsContent value="products"><ProductsPanel /></TabsContent>
            <TabsContent value="categories"><CategoriesPanel /></TabsContent>
            <TabsContent value="portfolio"><PortfolioPanel /></TabsContent>
            <TabsContent value="testimonials"><TestimonialsPanel /></TabsContent>
            <TabsContent value="content"><ContentPanel /></TabsContent>
          </Tabs>
        )}
      </section>
    </Layout>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    setLoading(true);
    const { error } = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setLoading(false);
    if (error) toast.error(error.message);
    else if (mode === "signup") toast.success("Account created. Check your email to verify.");
  }

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <div className="bg-card border border-primary/8 rounded-3xl p-10 shadow-elevated">
        <span className="eyebrow">Admin Access</span>
        <h1 className="mt-2 text-3xl font-display text-primary">Sign {mode === "signin" ? "in" : "up"}</h1>
        <form onSubmit={submit} className="space-y-4 mt-8">
          <input name="email" type="email" required placeholder="Email" className="w-full bg-surface border border-primary/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-accent" />
          <input name="password" type="password" required minLength={6} placeholder="Password" className="w-full bg-surface border border-primary/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-accent" />
          <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold disabled:opacity-60">{loading ? "…" : (mode === "signin" ? "Sign in" : "Create account")}</button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-6 text-xs text-muted-foreground hover:text-accent w-full text-center">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}

// ============================================================
// SHARED UI HELPERS
// ============================================================
const inputCls = "w-full bg-surface border border-primary/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent";
const labelCls = "block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-semibold";
const btnPrimary = "bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50";
const btnGhost = "px-4 py-2 rounded-lg text-xs uppercase tracking-widest border border-primary/15 hover:bg-surface transition-colors";

async function uploadImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("site-images").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) { toast.error(error.message); return null; }
  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  return data.publicUrl;
}

function ImageUploadField({ value, onChange, multiple = false }: { value: string[]; onChange: (v: string[]) => void; multiple?: boolean }) {
  const [uploading, setUploading] = useState(false);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const f of files) {
      const u = await uploadImage(f);
      if (u) urls.push(u);
    }
    onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
    setUploading(false);
    e.target.value = "";
  }
  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative size-20 rounded-lg overflow-hidden border border-primary/10 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center text-white">
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="inline-flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest border border-dashed border-primary/30 rounded-lg px-4 py-3 hover:bg-surface">
        <Upload className="size-4" />
        {uploading ? "Uploading…" : multiple ? "Add Images" : (value.length ? "Replace Image" : "Upload Image")}
        <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={onFile} disabled={uploading} />
      </label>
    </div>
  );
}

function ArrayField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input value={v} onChange={(e) => onChange(value.map((x, j) => j === i ? e.target.value : x))} className={inputCls} />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="px-3 rounded-lg hover:bg-destructive/10 text-destructive"><X className="size-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, ""])} className="text-xs uppercase tracking-widest text-accent hover:underline">+ Add item</button>
      </div>
    </div>
  );
}

// ============================================================
// QUOTES
// ============================================================
function QuotesPanel() {
  const [items, setItems] = useState<Quote[]>([]);
  useEffect(() => { void load(); }, []);
  async function load() {
    const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setItems((data ?? []) as Quote[]);
  }
  async function toggleStatus(q: Quote) {
    const next = q.status === "contacted" ? "new" : "contacted";
    const { error } = await supabase.from("quote_requests").update({ status: next }).eq("id", q.id);
    if (error) return toast.error(error.message);
    setItems((xs) => xs.map((x) => x.id === q.id ? { ...x, status: next } : x));
  }
  async function del(q: Quote) {
    if (!confirm("Delete this request?")) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", q.id);
    if (error) return toast.error(error.message);
    setItems((xs) => xs.filter((x) => x.id !== q.id));
  }
  return (
    <div>
      <h2 className="text-xl font-display text-primary mb-4">{items.length} Quote Requests</h2>
      <div className="space-y-3">
        {items.map((q) => (
          <div key={q.id} className="bg-card border border-primary/8 rounded-2xl p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-semibold text-primary">{q.name} <span className="text-muted-foreground font-normal">· {q.company ?? "—"}</span></p>
                <p className="text-xs text-muted-foreground mt-1">{q.email} · {q.phone ?? "no phone"} · {q.industry ?? "—"} · {q.quantity ?? "—"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${q.status === "contacted" ? "bg-accent/20 text-accent-foreground" : "bg-surface text-muted-foreground"}`}>{q.status}</span>
                <button onClick={() => toggleStatus(q)} className="text-[10px] uppercase tracking-widest text-accent hover:underline">Mark {q.status === "contacted" ? "new" : "contacted"}</button>
                <button onClick={() => del(q)} className="text-[10px] uppercase tracking-widest text-destructive hover:underline">Delete</button>
              </div>
            </div>
            {q.message && <p className="mt-3 text-sm text-foreground font-light leading-relaxed">{q.message}</p>}
            <p className="mt-3 text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(q.created_at).toLocaleString()}</p>
          </div>
        ))}
        {items.length === 0 && <div className="text-center text-muted-foreground text-sm py-12">No quote requests yet.</div>}
      </div>
    </div>
  );
}

// ============================================================
// CATEGORIES
// ============================================================
function CategoriesPanel() {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  useEffect(() => { void load(); }, []);
  async function load() {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setItems((data ?? []) as Category[]);
  }
  async function save() {
    if (!editing?.name || !editing.slug) return toast.error("Name and slug are required");
    const payload = { name: editing.name, slug: editing.slug, description: editing.description ?? null, image_url: editing.image_url ?? null, sort_order: editing.sort_order ?? 0 };
    const { error } = editing.id
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    void load();
  }
  async function del(id: string) {
    if (!confirm("Delete this category? Products will become orphaned.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display text-primary">{items.length} Categories</h2>
        <button onClick={() => setEditing({ sort_order: items.length })} className={btnPrimary}><Plus className="size-3.5 inline mr-1" /> Add Category</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((c) => (
          <div key={c.id} className="bg-card border border-primary/8 rounded-2xl p-5 flex gap-4">
            {c.image_url && <img src={c.image_url} alt="" className="size-16 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-primary">{c.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">/{c.slug}</p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setEditing(c)} className="p-2 hover:bg-surface rounded-lg"><Pencil className="size-4" /></button>
              <button onClick={() => del(c.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Category</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><label className={labelCls}>Name</label><input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Slug (url)</label><input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className={inputCls} /></div>
              <div><label className={labelCls}>Description</label><textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className={inputCls} /></div>
              <div><label className={labelCls}>Image</label><ImageUploadField value={editing.image_url ? [editing.image_url] : []} onChange={(v) => setEditing({ ...editing, image_url: v[0] ?? null })} /></div>
              <div><label className={labelCls}>Sort order</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
                <button onClick={save} className={btnPrimary}>Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// PRODUCTS
// ============================================================
function ProductsPanel() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  useEffect(() => { void load(); }, []);
  async function load() {
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setItems((p.data ?? []) as Product[]);
    setCats((c.data ?? []) as Category[]);
  }
  async function save() {
    if (!editing?.name || !editing.slug) return toast.error("Name and slug are required");
    const payload = {
      name: editing.name, slug: editing.slug,
      short_description: editing.short_description ?? null,
      description: editing.description ?? null,
      features: editing.features ?? [],
      customization_options: editing.customization_options ?? [],
      images: editing.images ?? [],
      category_id: editing.category_id ?? null,
      is_published: editing.is_published ?? true,
      sort_order: editing.sort_order ?? 0,
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    void load();
  }
  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  }
  const catName = (id: string | null) => cats.find((c) => c.id === id)?.name ?? "—";
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display text-primary">{items.length} Products</h2>
        <button onClick={() => setEditing({ is_published: true, sort_order: items.length, features: [], customization_options: [], images: [] })} className={btnPrimary}><Plus className="size-3.5 inline mr-1" /> Add Product</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((p) => (
          <div key={p.id} className="bg-card border border-primary/8 rounded-2xl p-5 flex gap-4">
            {p.images?.[0] ? <img src={p.images[0]} alt="" className="size-16 rounded-lg object-cover" /> : <div className="size-16 rounded-lg bg-muted" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-primary">{p.name} {!p.is_published && <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-2">(draft)</span>}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{catName(p.category_id)} · /{p.slug}</p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.short_description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setEditing(p)} className="p-2 hover:bg-surface rounded-lg"><Pencil className="size-4" /></button>
              <button onClick={() => del(p.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Product</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Name</label><input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Slug</label><input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className={inputCls} /></div>
              </div>
              <div><label className={labelCls}>Category</label>
                <select value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className={inputCls}>
                  <option value="">— None —</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Short description</label><input value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Full description</label><textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} className={inputCls} /></div>
              <ArrayField label="Features" value={editing.features ?? []} onChange={(v) => setEditing({ ...editing, features: v })} />
              <ArrayField label="Customisation options" value={editing.customization_options ?? []} onChange={(v) => setEditing({ ...editing, customization_options: v })} />
              <div><label className={labelCls}>Images (first is the cover)</label><ImageUploadField multiple value={editing.images ?? []} onChange={(v) => setEditing({ ...editing, images: v })} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Sort order</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} /></div>
                <label className="flex items-end gap-2 pb-2"><input type="checkbox" checked={editing.is_published ?? true} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} /> <span className="text-xs uppercase tracking-widest">Published</span></label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
                <button onClick={save} className={btnPrimary}>Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// PORTFOLIO
// ============================================================
function PortfolioPanel() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [editing, setEditing] = useState<Partial<Portfolio> | null>(null);
  useEffect(() => { void load(); }, []);
  async function load() {
    const { data } = await supabase.from("portfolio_items").select("*").order("sort_order");
    setItems((data ?? []) as Portfolio[]);
  }
  async function save() {
    if (!editing?.title || !editing.image_url || !editing.category) return toast.error("Title, category, and image are required");
    const payload = { title: editing.title, category: editing.category, description: editing.description ?? null, image_url: editing.image_url, sort_order: editing.sort_order ?? 0 };
    const { error } = editing.id
      ? await supabase.from("portfolio_items").update(payload).eq("id", editing.id)
      : await supabase.from("portfolio_items").insert(payload);
    if (error) return toast.error(error.message);
    setEditing(null); void load();
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display text-primary">{items.length} Portfolio items</h2>
        <button onClick={() => setEditing({ sort_order: items.length })} className={btnPrimary}><Plus className="size-3.5 inline mr-1" /> Add Item</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((p) => (
          <div key={p.id} className="bg-card border border-primary/8 rounded-2xl overflow-hidden">
            <img src={p.image_url} alt="" className="aspect-[4/3] object-cover w-full" />
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-widest text-accent">{p.category}</p>
              <p className="font-semibold text-primary mt-1">{p.title}</p>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setEditing(p)} className="p-1.5 hover:bg-surface rounded"><Pencil className="size-3.5" /></button>
                <button onClick={() => del(p.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Portfolio Item</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><label className={labelCls}>Title</label><input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Category</label><input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Description</label><textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className={inputCls} /></div>
              <div><label className={labelCls}>Image</label><ImageUploadField value={editing.image_url ? [editing.image_url] : []} onChange={(v) => setEditing({ ...editing, image_url: v[0] ?? "" })} /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
                <button onClick={save} className={btnPrimary}>Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// TESTIMONIALS
// ============================================================
function TestimonialsPanel() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  useEffect(() => { void load(); }, []);
  async function load() {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems((data ?? []) as Testimonial[]);
  }
  async function save() {
    if (!editing?.author_name || !editing.quote) return toast.error("Author and quote are required");
    const payload = { author_name: editing.author_name, author_role: editing.author_role ?? null, company: editing.company ?? null, quote: editing.quote, rating: editing.rating ?? 5, sort_order: editing.sort_order ?? 0 };
    const { error } = editing.id
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload);
    if (error) return toast.error(error.message);
    setEditing(null); void load();
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display text-primary">{items.length} Testimonials</h2>
        <button onClick={() => setEditing({ rating: 5, sort_order: items.length })} className={btnPrimary}><Plus className="size-3.5 inline mr-1" /> Add</button>
      </div>
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="bg-card border border-primary/8 rounded-2xl p-5">
            <p className="text-sm italic text-foreground/80 font-light">"{t.quote}"</p>
            <div className="flex justify-between items-end mt-3">
              <div>
                <p className="text-xs font-semibold text-primary">{t.author_name}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.company ?? ""}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(t)} className="p-2 hover:bg-surface rounded-lg"><Pencil className="size-4" /></button>
                <button onClick={() => del(t.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 className="size-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Testimonial</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><label className={labelCls}>Author</label><input value={editing.author_name ?? ""} onChange={(e) => setEditing({ ...editing, author_name: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Role</label><input value={editing.author_role ?? ""} onChange={(e) => setEditing({ ...editing, author_role: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Company</label><input value={editing.company ?? ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Quote</label><textarea value={editing.quote ?? ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} rows={4} className={inputCls} /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
                <button onClick={save} className={btnPrimary}>Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// SITE CONTENT (homepage / about / contact info)
// ============================================================
function ContentPanel() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const KEYS = [
    { key: "homepage", label: "Homepage" },
    { key: "about", label: "About Page" },
    { key: "contact", label: "Contact Information" },
  ];
  useEffect(() => { void load(); }, []);
  async function load() {
    const { data } = await supabase.from("site_content").select("*");
    setItems((data ?? []) as SiteContent[]);
  }
  function getValue(k: string) { return items.find((x) => x.key === k)?.value ?? {}; }
  async function save(k: string, raw: string) {
    let value: unknown;
    try { value = JSON.parse(raw); } catch { return toast.error("Invalid JSON"); }
    const { error } = await supabase.from("site_content").upsert({ key: k, value: value as never });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    void load();
  }
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Edit site-wide content as JSON. Future versions will offer a richer editor.</p>
      {KEYS.map((k) => <ContentRow key={k.key} k={k.key} label={k.label} initial={JSON.stringify(getValue(k.key), null, 2)} onSave={(v) => save(k.key, v)} />)}
    </div>
  );
}
function ContentRow({ k, label, initial, onSave }: { k: string; label: string; initial: string; onSave: (v: string) => void }) {
  const [val, setVal] = useState(initial);
  useEffect(() => { setVal(initial); }, [initial]);
  return (
    <div className="bg-card border border-primary/8 rounded-2xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-primary">{label} <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-2">{k}</span></h3>
        <button onClick={() => onSave(val)} className={btnPrimary}>Save</button>
      </div>
      <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={8} className={`${inputCls} font-mono text-xs`} />
    </div>
  );
}

// ============================================================
// HERO SLIDES
// ============================================================
function HeroSlidesPanel() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [editing, setEditing] = useState<Partial<HeroSlide> | null>(null);
  useEffect(() => { void load(); }, []);
  async function load() {
    const { data, error } = await supabase.from("hero_slides").select("*").order("sort_order");
    if (error) toast.error(error.message); else setItems((data ?? []) as HeroSlide[]);
  }
  async function save() {
    if (!editing?.headline || !editing.image_url) return toast.error("Headline and image are required");
    const payload = {
      headline: editing.headline,
      subheadline: editing.subheadline ?? null,
      image_url: editing.image_url,
      primary_cta_label: editing.primary_cta_label ?? null,
      primary_cta_href: editing.primary_cta_href ?? null,
      secondary_cta_label: editing.secondary_cta_label ?? null,
      secondary_cta_href: editing.secondary_cta_href ?? null,
      is_published: editing.is_published ?? true,
      sort_order: editing.sort_order ?? 0,
    };
    const { error } = editing.id
      ? await supabase.from("hero_slides").update(payload).eq("id", editing.id)
      : await supabase.from("hero_slides").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    void load();
  }
  async function del(id: string) {
    if (!confirm("Delete this slide?")) return;
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  }
  async function move(slide: HeroSlide, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const i = sorted.findIndex((x) => x.id === slide.id);
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const a = sorted[i], b = sorted[j];
    await supabase.from("hero_slides").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("hero_slides").update({ sort_order: a.sort_order }).eq("id", b.id);
    void load();
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display text-primary">{items.length} Hero Slides</h2>
        <button onClick={() => setEditing({ sort_order: items.length, is_published: true })} className={btnPrimary}><Plus className="size-3.5 inline mr-1" /> Add Slide</button>
      </div>
      <div className="space-y-3">
        {items.map((s, i) => (
          <div key={s.id} className="bg-card border border-primary/8 rounded-2xl p-5 flex gap-4 items-center">
            <img src={s.image_url} alt="" className="size-20 rounded-lg object-cover bg-surface" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-primary truncate">{s.headline}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.subheadline}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                {s.is_published ? "Published" : "Draft"} · Order {s.sort_order}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => move(s, -1)} disabled={i === 0} className="text-xs px-2 py-1 hover:bg-surface rounded disabled:opacity-30">↑</button>
              <button onClick={() => move(s, 1)} disabled={i === items.length - 1} className="text-xs px-2 py-1 hover:bg-surface rounded disabled:opacity-30">↓</button>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setEditing(s)} className="p-2 hover:bg-surface rounded-lg"><Pencil className="size-4" /></button>
              <button onClick={() => del(s.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center text-muted-foreground text-sm py-12">No slides yet. Add your first one.</div>}
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Hero Slide</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><label className={labelCls}>Background Image</label><ImageUploadField value={editing.image_url ? [editing.image_url] : []} onChange={(v) => setEditing({ ...editing, image_url: v[0] ?? "" })} /></div>
              <div><label className={labelCls}>Headline</label><input value={editing.headline ?? ""} onChange={(e) => setEditing({ ...editing, headline: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Subheadline</label><textarea value={editing.subheadline ?? ""} onChange={(e) => setEditing({ ...editing, subheadline: e.target.value })} rows={3} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Primary Button Text</label><input value={editing.primary_cta_label ?? ""} onChange={(e) => setEditing({ ...editing, primary_cta_label: e.target.value })} className={inputCls} placeholder="Request a Quote" /></div>
                <div><label className={labelCls}>Primary Button Link</label><input value={editing.primary_cta_href ?? ""} onChange={(e) => setEditing({ ...editing, primary_cta_href: e.target.value })} className={inputCls} placeholder="/contact-us" /></div>
                <div><label className={labelCls}>Secondary Button Text</label><input value={editing.secondary_cta_label ?? ""} onChange={(e) => setEditing({ ...editing, secondary_cta_label: e.target.value })} className={inputCls} placeholder="View Collections" /></div>
                <div><label className={labelCls}>Secondary Button Link</label><input value={editing.secondary_cta_href ?? ""} onChange={(e) => setEditing({ ...editing, secondary_cta_href: e.target.value })} className={inputCls} placeholder="/category" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Sort order</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} /></div>
                <div className="flex items-end gap-2"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={editing.is_published ?? true} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} /> Published</label></div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
                <button onClick={save} className={btnPrimary}>Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// WEBSITE IMAGES — manage every static image used across the site
// ============================================================
function SiteImagesPanel() {
  const [map, setMap] = useAllSiteImages();
  const [saving, setSaving] = useState<string | null>(null);

  async function setSlot(key: string, url: string | null) {
    const next = { ...map };
    if (url) next[key] = url; else delete next[key];
    setSaving(key);
    try {
      await saveSiteImages(next);
      setMap(next);
      toast.success(url ? "Image updated" : "Image removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  }

  // Group slots by page for nicer presentation
  const grouped = IMAGE_SLOTS.reduce<Record<string, typeof IMAGE_SLOTS[number][]>>((acc, s) => {
    (acc[s.page] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-display text-primary">Website Images</h2>
        <p className="text-sm text-muted-foreground mt-1 font-light">
          Upload or replace any image used across the website. Changes appear immediately on the live site.
          Leave a slot empty to fall back to the default image.
        </p>
      </div>
      {Object.entries(grouped).map(([page, slots]) => (
        <div key={page}>
          <h3 className="eyebrow mb-4">{page}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((s) => {
              const url = map[s.key];
              return (
                <div key={s.key} className="bg-card border border-primary/8 rounded-2xl overflow-hidden">
                  <div className="aspect-[4/3] bg-surface relative">
                    {url ? (
                      <img src={url} alt={s.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-xs text-muted-foreground uppercase tracking-widest">
                        Using default
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-primary">{s.label}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{s.key}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className={`${btnGhost} cursor-pointer inline-flex items-center gap-2 ${saving === s.key ? "opacity-50 pointer-events-none" : ""}`}>
                        <Upload className="size-3.5" />
                        {url ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={saving === s.key}
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            if (!f) return;
                            const u = await uploadImage(f);
                            if (u) await setSlot(s.key, u);
                          }}
                        />
                      </label>
                      {url && (
                        <button
                          onClick={() => setSlot(s.key, null)}
                          disabled={saving === s.key}
                          className="text-[10px] uppercase tracking-widest text-destructive hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
