import { motion } from "framer-motion";
import { Target, Eye, Award, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: "500+", label: t("Članova", "Members") },
    { icon: Award, value: "15+", label: t("Godina iskustva", "Years of Experience") },
    { icon: Target, value: "200+", label: t("Projekata", "Projects") },
    { icon: Eye, value: "30+", label: t("Partnera", "Partners") },
  ];

  return (
    <section id="o-nama" className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              {t("Tko smo", "About Us")}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              {t("Udruga za ljude i organizacijsku kulturu", "Association for People and Organizational Culture")}
            </h2>
            <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
              <p>
                {t(
                  "Osnovani smo s ciljem profesionalizacije upravljanja ljudskim potencijalima u Hrvatskoj. Okupljamo HR stručnjake, menadžere i poslovne lidere koji dijele viziju modernog, pravednog i učinkovitog radnog okruženja.",
                  "We were founded to professionalize HR management in Croatia. We bring together HR professionals, managers, and business leaders who share a vision of a modern, fair, and effective work environment."
                )}
              </p>
              <p>
                {t(
                  "Naša misija je promicanje najboljih praksi u upravljanju ljudskim potencijalima, pružanje podrške profesionalcima i zagovaranje politika koje unapređuju kvalitetu radnog života.",
                  "Our mission is to promote best practices in HR management, provide support to professionals, and advocate for policies that improve the quality of working life."
                )}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-accent rounded-xl p-6 text-center border border-primary/10"
              >
                <s.icon className="w-7 h-7 text-primary mx-auto mb-3" />
                <div className="font-heading text-3xl font-bold text-foreground">{s.value}</div>
                <div className="text-muted-foreground text-xs mt-1 font-body">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
