import { Link } from "@tanstack/react-router";
import { Heart, Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary fill-current" />
            </div>
            <div className="font-display text-xl font-bold">నీలకంఠ</div>
          </div>
          <p className="text-sm text-primary-foreground/75 leading-relaxed font-telugu">
            తెలుగు కుటుంబాల కోసం నమ్మదగిన మ్యాట్రిమొనీ ప్లాట్‌ఫామ్. మీ జీవిత భాగస్వామిని గౌరవంగా కనుగొనండి.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gold font-telugu">త్వరిత లింకులు</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80 font-telugu">
            <li><Link to="/browse">ప్రొఫైల్స్ చూడండి</Link></li>
            <li><Link to="/dashboard">డాష్‌బోర్డ్</Link></li>
            <li><Link to="/about">మా గురించి</Link></li>
            <li><Link to="/register">ఉచిత నమోదు</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gold font-telugu">కులాలు</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80 font-telugu">
            <li>కమ్మ మ్యాట్రిమొనీ</li>
            <li>రెడ్డి మ్యాట్రిమొనీ</li>
            <li>బ్రాహ్మణ మ్యాట్రిమొనీ</li>
            <li>కాపు మ్యాట్రిమొనీ</li>
            <li>రాజు, యాదవ, ఇతర</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gold font-telugu">సంప్రదించండి</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> care@neelakanta.com</li>
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
          <span className="font-telugu">ప్రేమతో తయారు చేయబడింది · Made in India</span>
        </div>
      </div>
    </footer>
  );
}
