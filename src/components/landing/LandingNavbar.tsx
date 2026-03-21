import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-horizons-black.svg";

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <img
            src={logo}
            alt="People & Culture HUB"
            className={`w-auto transition-all duration-300 ${scrolled ? "h-20" : "h-20 brightness-0 invert"}`}
          />
        </button>

        <div className="hidden md:flex items-center gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
          <Button
            size="sm"
            variant="outline"
            className={scrolled ? "" : "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"}
            asChild
          >
            <Link to="/council-login">Login</Link>
          </Button>
          <button
            onClick={() => setLang(lang === "hr" ? "en" : "hr")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors rounded-md px-2.5 py-1.5 border ${
              scrolled
                ? "text-muted-foreground hover:text-foreground border-border"
                : "text-primary-foreground/80 hover:text-primary-foreground border-primary-foreground/20 bg-primary-foreground/10"
            }`}
          >
            <Globe size={14} />
            {lang === "hr" ? "EN" : "HR"}
          </button>
        </div>

        <button
          className={`md:hidden transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-b border-border px-6 pb-4 space-y-3">
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
