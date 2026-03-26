import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";
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

          <div className="flex flex-col items-end">
            <h4 className="font-heading text-xs font-semibold text-primary-foreground uppercase tracking-wider mb-2 text-right">
              {t("Pratite nas", "Follow us")}
            </h4>
            <a
              href="https://www.linkedin.com/company/108869392"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="People & Culture HUB na LinkedInu"
              className="inline-flex items-center justify-center rounded-full border border-primary-foreground/15 p-2.5 text-primary-foreground/50 transition-colors hover:text-primary hover:border-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-9.5 6.5H7V17h2.5zM8.25 6.56a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88M17 12.03c0-2.5-1.33-3.66-3.1-3.66-1.43 0-2.07.79-2.43 1.34V9.5H9V17h2.47v-4.18c0-1.1.21-2.17 1.57-2.17 1.34 0 1.36 1.25 1.36 2.24V17z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-4 flex flex-col items-center gap-2">
          <p className="text-primary-foreground/30 text-[10px] font-body text-center">
            © {new Date().getFullYear()} People & Culture HUB. {t("Sva prava pridržana.", "All rights reserved.")}
          </p>
          <Link
            to="/politika-privatnosti"
            className="text-primary-foreground/40 hover:text-primary transition-colors text-[10px] font-body"
          >
            {t("Politika privatnosti", "Privacy Policy")}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
