import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, X, MessageCircle, LogOut, User as UserIcon, LayoutDashboard, Globe } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

type NavItem = { to: string; te: string; en: string; auth?: boolean };
const nav: readonly NavItem[] = [
  { to: "/", te: "హోమ్", en: "Home" },
  { to: "/browse", te: "ప్రొఫైల్స్", en: "Profiles" },
  { to: "/dashboard", te: "డాష్‌బోర్డ్", en: "Dashboard", auth: true },
  { to: "/messages", te: "సందేశాలు", en: "Messages", auth: true },
  { to: "/about", te: "మా గురించి", en: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLang();

  const handleSignOut = async () => {
    await signOut();
    setMenu(false);
    navigate({ to: "/" });
  };

  const toggleLang = () => setLang(lang === "te" ? "en" : "te");

  const visible = nav.filter((n) => !n.auth || user);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-md bg-background/85">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-full btn-royal">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl font-bold text-primary">{t("నీలకంఠ", "Neelakanta")}</div>
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase">Neelakanta Matrimony</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {visible.map((n) => {
            const active = path === n.to;
            return (
              <Link key={n.to} to={n.to as any} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${lang === "te" ? "font-telugu" : ""} ${active ? "text-primary bg-secondary" : "text-foreground/75 hover:text-primary hover:bg-secondary/60"}`}>{t(n.te, n.en)}</Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggleLang} title="Language" className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/70 text-xs font-semibold">
            <Globe className="h-3.5 w-3.5" />
            {lang === "te" ? "EN" : "తె"}
          </button>
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/70">
                <div className="h-7 w-7 rounded-full btn-royal flex items-center justify-center text-xs font-bold uppercase">{user.email?.[0] ?? "U"}</div>
                <span className="text-sm font-medium max-w-[140px] truncate">{user.email}</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 royal-card p-1.5 z-50 bg-card">
                  <Link to="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary text-sm"><LayoutDashboard className="h-4 w-4" /> {t("డాష్‌బోర్డ్", "Dashboard")}</Link>
                  <Link to="/profile-edit" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary text-sm"><UserIcon className="h-4 w-4" /> {t("నా ప్రొఫైల్", "My Profile")}</Link>
                  <Link to="/messages" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary text-sm"><MessageCircle className="h-4 w-4" /> {t("సందేశాలు", "Messages")}</Link>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary text-sm text-destructive"><LogOut className="h-4 w-4" /> {t("లాగ్ అవుట్", "Log out")}</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary hover:underline">{t("లాగిన్", "Login")}</Link>
              <Link to="/register" className="btn-royal px-5 py-2.5 rounded-full text-sm font-semibold">{t("ఉచిత నమోదు", "Free Sign Up")}</Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleLang} className="px-2.5 py-1.5 rounded-full bg-secondary text-xs font-semibold">{lang === "te" ? "EN" : "తె"}</button>
          <button className="p-2" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-3 space-y-1">
            {visible.map((n) => (<Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-md text-sm hover:bg-secondary">{t(n.te, n.en)}</Link>))}
            <div className="pt-2 flex gap-2">
              {user ? (
                <><Link to="/profile-edit" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-full border border-primary text-primary text-sm">{t("ప్రొఫైల్", "Profile")}</Link>
                <button onClick={handleSignOut} className="flex-1 text-center btn-royal px-4 py-2.5 rounded-full text-sm">{t("లాగ్ అవుట్", "Log out")}</button></>
              ) : (
                <><Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-full border border-primary text-primary text-sm">{t("లాగిన్", "Login")}</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center btn-royal px-4 py-2.5 rounded-full text-sm">{t("నమోదు", "Sign Up")}</Link></>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
