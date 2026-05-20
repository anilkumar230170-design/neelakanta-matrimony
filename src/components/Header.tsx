import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "హోమ్", labelEn: "Home" },
  { to: "/browse", label: "ప్రొఫైల్స్", labelEn: "Browse" },
  { to: "/dashboard", label: "డాష్‌బోర్డ్", labelEn: "Dashboard" },
  { to: "/about", label: "మా గురించి", labelEn: "About" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

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
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors font-telugu ${
                  active ? "text-primary bg-secondary" : "text-foreground/75 hover:text-primary hover:bg-secondary/60"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary hover:underline font-telugu">
            లాగిన్
          </Link>
          <Link
            to="/register"
            className="btn-royal px-5 py-2.5 rounded-full text-sm font-semibold font-telugu"
          >
            ఉచిత నమోదు
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-3 space-y-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-md text-sm font-telugu hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Link to="/login" className="flex-1 text-center px-4 py-2.5 rounded-full border border-primary text-primary text-sm font-telugu">లాగిన్</Link>
              <Link to="/register" className="flex-1 text-center btn-royal px-4 py-2.5 rounded-full text-sm font-telugu">నమోదు</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
