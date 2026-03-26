import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const LandingFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-deep py-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
          <div className="space-y-2">
            <h4 className="font-heading text-xs font-semibold text-primary-foreground uppercase tracking-wider mb-2">
              {t("Kontakt", "Contact")}
            </h4>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <div>
                <p className="text-primary-foreground/60 text-[11px] font-body">E-mail</p>
                <p className="text-primary-foreground/40 text-[11px] font-body">hub@peopleandculture.hr</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <div>
                <p className="text-primary-foreground/60 text-[11px] font-body">{t("Centrala", "Phone")}</p>
                <p className="text-primary-foreground/40 text-[11px] font-body">+385 1 4103 734</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <div>
                <p className="text-primary-foreground/60 text-[11px] font-body">{t("Adresa", "Address")}</p>
                <p className="text-primary-foreground/40 text-[11px] font-body">Remetinečka cesta 102D, 10000 Zagreb</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div>
              <h4 className="font-heading text-xs font-semibold text-primary-foreground uppercase tracking-wider mb-2 text-right">
                {t("Pratite nas", "Follow us")}
              </h4>
              <a
                href="https://www.linkedin.com/company/108869392"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary-foreground/50 hover:text-primary transition-colors text-[11px] font-body"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
            <Link
              to="/politika-privatnosti"
              className="text-primary-foreground/40 hover:text-primary transition-colors text-[11px] font-body"
            >
              {t("Politika privatnosti", "Privacy Policy")}
            </Link>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-4 text-center">
          <p className="text-primary-foreground/30 text-[10px] font-body">
            © {new Date().getFullYear()} People & Culture HUB. {t("Sva prava pridržana.", "All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
