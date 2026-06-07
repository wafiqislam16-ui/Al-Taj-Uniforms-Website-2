import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional(),
  industry: z.string().trim().max(80).optional(),
  quantity: z.string().trim().max(40).optional(),
  message: z.string().trim().max(2000).optional(),
});

const INDUSTRIES = ["Healthcare","Hospitality","Construction","Security","Corporate","Industrial","Education","Government","Other"];

export function QuoteForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [loading, setLoading] = useState(false);
  const dark = variant === "dark";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("quote_requests").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Could not submit. Please try again or contact us directly.");
      return;
    }
    toast.success("Thank you. We'll be in touch within one business day.");
    (e.target as HTMLFormElement).reset();
  }

  const labelCls = `text-[10px] uppercase tracking-widest font-semibold ${dark ? "text-white/50" : "text-muted-foreground"} mb-2 block`;
  const inputCls = dark
    ? "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-white/30"
    : "w-full bg-surface border border-primary/10 rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-muted-foreground/60";

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>Full Name</label>
        <input name="name" required className={inputCls} placeholder="Jane Doe" />
      </div>
      <div>
        <label className={labelCls}>Company</label>
        <input name="company" className={inputCls} placeholder="Acme Group" />
      </div>
      <div>
        <label className={labelCls}>Email</label>
        <input type="email" name="email" required className={inputCls} placeholder="you@company.com" />
      </div>
      <div>
        <label className={labelCls}>Phone</label>
        <input name="phone" className={inputCls} placeholder="+971 ..." />
      </div>
      <div>
        <label className={labelCls}>Industry</label>
        <select name="industry" className={inputCls} defaultValue="">
          <option value="" disabled>Select industry</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Estimated Quantity</label>
        <input name="quantity" className={inputCls} placeholder="e.g. 250 units" />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Message</label>
        <textarea name="message" rows={4} className={inputCls} placeholder="Tell us about your project, timelines, and any branding requirements." />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="md:col-span-2 mt-2 bg-accent text-accent-foreground font-semibold tracking-[0.18em] uppercase text-xs py-4 rounded-xl hover:brightness-105 transition-all shadow-lg shadow-primary/10 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit Quote Request"}
      </button>
    </form>
  );
}
