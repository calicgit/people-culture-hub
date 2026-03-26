import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const MembershipSection = () => {
  const { t } = useLanguage();

  const tiers = [
    {
      name: t("Individualno", "Individual"),
      price: t("200 kn/god", "€27/yr"),
      features: [
        t("Pristup svim edukacijama", "Access to all training sessions"),
        t("Newsletter i resursi", "Newsletter & resources"),
        t("Umrežavanje na događanjima", "Networking at events"),
        t("Popusti na konferencije", "Conference discounts"),
      ],
    },
    {
      name: t("Korporativno", "Corporate"),
      price: t("1.500 kn/god", "€200/yr"),
      popular: true,
      features: [
        t("Do 10 članova tima", "Up to 10 team members"),
        t("Pristup svim edukacijama", "Access to all training"),
        t("Benchmarking izvještaji", "Benchmarking reports"),
        t("Savjetodavna podrška", "Advisory support"),
        t("Prioritetno umrežavanje", "Priority networking"),
      ],
    },
    {
      name: t("Strateško", "Strategic"),
      price: t("Po dogovoru", "Custom"),
      features: [
        t("Neograničen broj članova", "Unlimited members"),
        t("Prilagođene edukacije", "Custom training"),
        t("Ekskluzivna istraživanja", "Exclusive research"),
        t("Mjesto u savjetodavnom vijeću", "Advisory council seat"),
      ],
    },
  ];

  return (
    <section id="clanstvo" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            {t("Članstvo", "Membership")}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {t("Postanite dio naše zajednice", "Become Part of Our Community")}
          </h2>
          <p className="text-muted-foreground font-body">
            {t(
              "Odaberite razinu članstva koja odgovara vašim potrebama i počnite koristiti sve pogodnosti.",
              "Choose the membership level that fits your needs and start enjoying all benefits."
            )}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-8 flex flex-col ${
                tier.popular
                  ? "bg-secondary text-secondary-foreground border-secondary ring-2 ring-primary"
                  : "bg-card border-border"
              }`}
            >
              {tier.popular && (
                <span className="self-start px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-3">
                  {t("Najpopularnije", "Most Popular")}
                </span>
              )}
              <h3 className="font-heading text-xl font-bold mb-1">{tier.name}</h3>
              <div className="font-heading text-3xl font-bold mb-6">{tier.price}</div>
              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm font-body">
                    <Check size={16} className={tier.popular ? "text-primary mt-0.5 shrink-0" : "text-primary mt-0.5 shrink-0"} />
                    <span className={tier.popular ? "text-secondary-foreground/80" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/prijava-clanstvo" className="w-full">
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                >
                  {t("Učlani se", "Join Now")}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
