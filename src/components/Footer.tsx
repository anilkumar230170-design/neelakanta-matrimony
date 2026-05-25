import { Link } from "@tanstack/react-router";
import { Heart, Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary fill-current" />
            </div>
            <div className="font-display text-xl font-bold">{t("నీలకంఠ", "Neelakanta")}</div>
          </div>
          <p className="text-sm text-primary-foreground/75 leading-relaxed">
            {t(
              "తెలుగు కుటుంబాల కోసం నమ్మదగిన మ్యాట్రిమొనీ ప్లాట్‌ఫామ్. మీ జీవిత భాగస్వామిని గౌరవంగా కనుగొనండి.",
              "A trusted matrimony platform for Telugu families. Find your life partner with dignity and care."
            )}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gold">{t("త్వరిత లింకులు", "Quick Links")}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/browse">{t("ప్రొఫైల్స్ చూడండి", "Browse Profiles")}</Link></li>
            <li><Link to="/dashboard">{t("డాష్‌బోర్డ్", "Dashboard")}</Link></li>
            <li><Link to="/about">{t("మా గురించి", "About Us")}</Link></li>
            <li><Link to="/register">{t("ఉచిత నమోదు", "Free Sign Up")}</Link></li>
          </ul>
        </div>


        <div>
          <h4 className="font-semibold mb-3 text-gold">{t("సంప్రదించండి", "Contact")}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>+91 8805865828</span></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>care@neelakanta.com</span></li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-primary transition-colors" href="#"><Facebook className="h-4 w-4" /></a>
            <a className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-primary transition-colors" href="#"><Instagram className="h-4 w-4" /></a>
            <a className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-primary transition-colors" href="#"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-primary-foreground/60 flex flex-wrap justify-between gap-2">
          <span>© 2026 Neelakanta Matrimony. All rights reserved.</span>
          <span>Owned and developed by Anilkumar Kadavergu</span>
          <span>{t("ప్రేమతో తయారు చేయబడింది · Made in India", "Made with love · Made in India")}</span>
        </div>
      </div>
    </footer>
  );
}
