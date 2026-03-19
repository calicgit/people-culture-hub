import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NewsSection = () => {
  const { t } = useLanguage();

  const news = [
    {
      date: "15. ožujka 2026.",
      dateEn: "March 15, 2026",
      title: t("Konferencija o budućnosti rada u Zagrebu", "Conference on the Future of Work in Zagreb"),
      desc: t(
        "Najavljena je godišnja konferencija udruge s fokusom na digitalnu transformaciju i hibridne modele rada.",
        "The association's annual conference has been announced, focusing on digital transformation and hybrid work models."
      ),
      tag: t("Događaj", "Event"),
    },
    {
      date: "28. veljače 2026.",
      dateEn: "February 28, 2026",
      title: t("Nova istraživanja o zadovoljstvu zaposlenika", "New Research on Employee Satisfaction"),
      desc: t(
        "Objavljeni rezultati istraživanja o zadovoljstvu zaposlenika u hrvatskim tvrtkama s preporukama za poboljšanje.",
        "Published results of employee satisfaction research in Croatian companies with improvement recommendations."
      ),
      tag: t("Istraživanje", "Research"),
    },
    {
      date: "10. veljače 2026.",
      dateEn: "February 10, 2026",
      title: t("Partnerstvo s europskim HR mrežama", "Partnership with European HR Networks"),
      desc: t(
        "Udruga je potpisala sporazum o suradnji s vodećim europskim organizacijama za upravljanje ljudskim potencijalima.",
        "The association signed a cooperation agreement with leading European HR management organizations."
      ),
      tag: t("Vijest", "News"),
    },
  ];

  return (
    <section id="novosti" className="py-20 bg-warm-gray">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            {t("Novosti", "News")}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {t("Najnovije vijesti", "Latest News")}
          </h2>
          <p className="text-muted-foreground font-body">
            {t("Pratite naše aktivnosti, događanja i najnovija istraživanja.", "Follow our activities, events, and latest research.")}
          </p>
        </motion.div>

        <div className="space-y-4">
          {news.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl border border-border p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-body md:w-36 shrink-0">
                <CalendarDays size={14} />
                {t(n.date, n.dateEn)}
              </div>
              <span className="self-start px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {n.tag}
              </span>
              <div className="flex-1">
                <h4 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {n.title}
                </h4>
                <p className="text-muted-foreground text-sm font-body mt-1">{n.desc}</p>
              </div>
              <ArrowRight
                size={16}
                className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 hidden md:block"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
