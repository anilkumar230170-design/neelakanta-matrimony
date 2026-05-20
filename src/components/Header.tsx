import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, X, MessageCircle, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

type NavItem = { to: string; label: string; auth?: boolean };
const nav: readonly NavItem[] = [
  { to: "/", label: "హోమ్" },
  { to: "/browse", label: "ప్రొఫైల్స్" },
  { to: "/dashboard", label: "డాష్‌బోర్డ్", auth: true },
  { to: "/messages", label: "సందేశాలు", auth: true },
  { to: "/about", label: "మా గురించి" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setMenu(false);
    navigate({ to: "/" });
  };

  const visible = nav.filter((n) => !n.auth || user);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-md bg-background/85">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-full btn-royal">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl font-bold text-primary">నీలకంఠ</div>
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase">Neelakanta Matrimony</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {visible.map((n) => {
            const active = path === n.to;
            return (
              <Link key={n.to} to={n.to as any} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors font-telugu ${active ? "text-primary bg-secondary" : "text-foreground/75 hover:text-primary hover:bg-secondary/60"}`}>{n.label}</Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/70">
                <div className="h-7 w-7 rounded-full btn-royal flex items-center justify-center text-xs font-bold uppercase">{user.email?.[0] ?? "U"}</div>
                <span className="text-sm font-medium max-w-[140px] truncate">{user.email}</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 royal-card p-1.5 z-50 bg-card">
                  <Link to="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary text-sm font-telugu"><LayoutDashboard className="h-4 w-4" /> డాష్‌బోర్డ్</Link>
                  <Link to="/profile-edit" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary text-sm font-telugu"><UserIcon className="h-4 w-4" /> నా ప్రొఫైల్</Link>
                  <Link to="/messages" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary text-sm font-telugu"><MessageCircle className="h-4 w-4" /> సందేశాలు</Link>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary text-sm text-destructive font-telugu"><LogOut className="h-4 w-4" /> లాగ్ అవుట్</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary hover:underline font-telugu">లాగిన్</Link>
              <Link to="/register" className="btn-royal px-5 py-2.5 rounded-full text-sm font-semibold font-telugu">ఉచిత నమోదు</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-3 space-y-1">
            {visible.map((n) => (<Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-telugu hover:bg-secondary">{n.label}</Link>))}
            <div className="pt-2 flex gap-2">
              {user ? (
                <><Link to="/profile-edit" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-full border border-primary text-primary text-sm font-telugu">ప్రొఫైల్</Link>
                <button onClick={handleSignOut} className="flex-1 text-center btn-royal px-4 py-2.5 rounded-full text-sm font-telugu">లాగ్ అవుట్</button></>
              ) : (
                <><Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-full border border-primary text-primary text-sm font-telugu">లాగిన్</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center btn-royal px-4 py-2.5 rounded-full text-sm font-telugu">నమోదు</Link></>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
