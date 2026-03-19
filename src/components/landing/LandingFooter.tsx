import { useLanguage } from "@/contexts/LanguageContext";
import logoWhite from "@/assets/logo-white.svg";

const LandingFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-deep py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-primary-foreground flex items-center gap-2">
              <img src={logoWhite} alt="People & Culture HUB" className="h-36 w-auto" />
            </h3>
            <p className="text-primary-foreground/40 text-sm font-body mt-1">
              {t(
                "Unapređujemo upravljanje ljudskim potencijalima u Hrvatskoj.",
                "Advancing HR management in Croatia."
              )}
            </p>
          </div>
          <p className="text-primary-foreground/30 text-xs font-body">
            © {new Date().getFullYear()} People & Culture HUB. {t("Sva prava pridržana.", "All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
