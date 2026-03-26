import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const LandingFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-deep py-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
          <div className="space-y-0.5">
            <h4 className="font-heading text-xs font-semibold text-primary-foreground uppercase tracking-wider mb-2">
              {t("Kontakt", "Contact")}
            </h4>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <div className="leading-tight">
                <p className="text-primary-foreground/60 text-[11px] font-body leading-none">E-mail</p>
                <a href="mailto:hub@peopleandculture.hr" className="text-primary-foreground/40 hover:text-primary transition-colors text-[11px] font-body leading-none">hub@peopleandculture.hr</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <div className="leading-tight">
                <p className="text-primary-foreground/60 text-[11px] font-body leading-none">{t("Centrala", "Phone")}</p>
                <a href="tel:+38514103734" className="text-primary-foreground/40 hover:text-primary transition-colors text-[11px] font-body leading-none">+385 1 4103 734</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <div className="leading-tight">
                <p className="text-primary-foreground/60 text-[11px] font-body leading-none">{t("Adresa", "Address")}</p>
                <a href="https://maps.google.com/?q=Remetinečka+cesta+102D,+10000+Zagreb" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/40 hover:text-primary transition-colors text-[11px] font-body leading-none">Remetinečka cesta 102D, 10000 Zagreb</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <h4 className="font-heading text-xs font-semibold text-primary-foreground uppercase tracking-wider mb-2 text-right">
              {t("Pratite nas", "Follow us")}
            </h4>
            <a
              href="https://www.linkedin.com/company/108869392"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="People & Culture HUB na LinkedInu"
              className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 72 72"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <rect width="72" height="72" rx="8" fill="#0A66C2" />
                <path
                  d="M20.1 30.5h6.4V51h-6.4V30.5zM23.3 18c2.1 0 3.8 1.7 3.8 3.8s-1.7 3.8-3.8 3.8-3.8-1.7-3.8-3.8 1.7-3.8 3.8-3.8M31.1 30.5h6.1v2.8h.1c.9-1.6 3-3.3 6.1-3.3 6.5 0 7.7 4.3 7.7 9.9V51h-6.4V41.4c0-2.3 0-5.2-3.2-5.2-3.2 0-3.7 2.5-3.7 5V51h-6.4V30.5z"
                  fill="#fff"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-4 relative flex items-center justify-center">
          <p className="text-primary-foreground/30 text-[10px] font-body text-center">
            © {new Date().getFullYear()} People & Culture HUB. {t("Sva prava pridržana.", "All rights reserved.")}
          </p>
          <Link
            to="/politika-privatnosti"
            className="absolute right-0 text-primary-foreground/40 hover:text-primary transition-colors text-[10px] font-body"
          >
            {t("Politika privatnosti", "Privacy Policy")}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
