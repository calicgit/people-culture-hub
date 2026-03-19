import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const navItems = [
    { id: "novosti", label: t("Novosti", "News") },
    { id: "o-nama", label: t("Tko smo", "About Us") },
    { id: "sto-radimo", label: t("Što radimo", "What We Do") },
    { id: "clanstvo", label: t("Članstvo", "Membership") },
    { id: "kontakt", label: t("Kontakt", "Contact") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <button onClick={() => scrollTo("hero")} className="font-heading text-lg font-bold text-foreground">
          People & Culture <span className="text-primary">HUB</span>
        </button>

        <div className="hidden lg:flex items-center gap-5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ))}
          <Button size="sm" variant="outline" asChild>
            <Link to="/council-login">Login</Link>
          </Button>
          <button
            onClick={() => setLang(lang === "hr" ? "en" : "hr")}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-2.5 py-1.5"
          >
            <Globe size={14} />
            {lang === "hr" ? "EN" : "HR"}
          </button>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-card border-b border-border px-6 pb-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
          <Button size="sm" className="w-full" variant="outline" asChild>
            <Link to="/council-login">Login</Link>
          </Button>
          <button
            onClick={() => { setLang(lang === "hr" ? "en" : "hr"); setOpen(false); }}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <Globe size={14} />
            {lang === "hr" ? "Switch to English" : "Prebaci na Hrvatski"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
