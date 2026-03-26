import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, MapPin, Phone } from "lucide-react";

const LandingFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-deep py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary-foreground">Email</h4>
              <p className="text-primary-foreground/50 text-sm font-body">hub@peopleandculture.hr</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary-foreground">{t("Centrala", "Phone")}</h4>
              <p className="text-primary-foreground/50 text-sm font-body">+385 1 4103 734</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary-foreground">{t("Adresa", "Address")}</h4>
              <p className="text-primary-foreground/50 text-sm font-body">
                Remetinečka cesta 102D, 10000 Zagreb
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-primary-foreground/30 text-xs font-body">
            © {new Date().getFullYear()} People & Culture HUB. {t("Sva prava pridržana.", "All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
