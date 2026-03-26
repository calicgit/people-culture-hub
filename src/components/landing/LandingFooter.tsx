import { useLanguage } from "@/contexts/LanguageContext";

const LandingFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-deep py-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
          <div />
          <div className="text-right space-y-2">
            <h4 className="font-heading text-xs font-semibold text-primary-foreground uppercase tracking-wider mb-2">
              {t("Kontakt", "Contact")}
            </h4>
            <div>
              <p className="text-primary-foreground/60 text-[11px] font-body">E-mail</p>
              <p className="text-primary-foreground/40 text-[11px] font-body">hub@peopleandculture.hr</p>
            </div>
            <div>
              <p className="text-primary-foreground/60 text-[11px] font-body">{t("Centrala", "Phone")}</p>
              <p className="text-primary-foreground/40 text-[11px] font-body">+385 1 4103 734</p>
            </div>
            <div>
              <p className="text-primary-foreground/60 text-[11px] font-body">{t("Adresa", "Address")}</p>
              <p className="text-primary-foreground/40 text-[11px] font-body">Remetinečka cesta 102D, 10000 Zagreb</p>
            </div>
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
