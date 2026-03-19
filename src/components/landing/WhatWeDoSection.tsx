import { motion } from "framer-motion";
import { GraduationCap, Briefcase, HeartHandshake, Scale, Lightbulb, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhatWeDoSection = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: GraduationCap,
      title: t("Edukacija i razvoj", "Education & Development"),
      desc: t("Organiziramo seminare, radionice i certifikacijske programe za HR profesionalce.", "We organize seminars, workshops, and certification programs for HR professionals."),
    },
    {
      icon: Briefcase,
      title: t("Savjetovanje", "Consulting"),
      desc: t("Pružamo stručno savjetovanje tvrtkama o upravljanju ljudskim potencijalima.", "We provide expert consulting to companies on HR management."),
    },
    {
      icon: HeartHandshake,
      title: t("Umrežavanje", "Networking"),
      desc: t("Povezujemo profesionalce kroz redovite susrete, konferencije i online platforme.", "We connect professionals through regular meetups, conferences, and online platforms."),
    },
    {
      icon: Scale,
      title: t("Zagovaranje", "Advocacy"),
      desc: t("Zagovaramo politike koje unapređuju radna prava i kvalitetu radnog okruženja.", "We advocate for policies that improve labor rights and workplace quality."),
    },
    {
      icon: Lightbulb,
      title: t("Istraživanje", "Research"),
      desc: t("Provodimo istraživanja o trendovima u upravljanju ljudskim potencijalima.", "We conduct research on trends in HR management."),
    },
    {
      icon: BarChart3,
      title: t("Benchmarking", "Benchmarking"),
      desc: t("Usporedne analize HR praksi koje pomažu tvrtkama prepoznati prilike za napredak.", "Comparative HR practice analyses that help companies identify improvement opportunities."),
    },
  ];

  return (
    <section id="sto-radimo" className="py-20 bg-warm-gray">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            {t("Naše aktivnosti", "Our Activities")}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {t("Što radimo", "What We Do")}
          </h2>
          <p className="text-muted-foreground font-body">
            {t(
              "Aktivno djelujemo na više područja kako bismo unaprijedili HR praksu i poslovno okruženje.",
              "We are active in multiple areas to improve HR practices and the business environment."
            )}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm font-body">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
