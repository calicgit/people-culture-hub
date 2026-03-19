import { motion } from "framer-motion";

const stats = [
  { value: "15K+", label: "Lives Impacted" },
  { value: "120+", label: "Workshops Held" },
  { value: "35", label: "Communities Reached" },
  { value: "8", label: "Years of Service" },
];

const ImpactSection = () => (
  <section id="impact" className="py-24 bg-primary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground">Our Impact</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-2">{s.value}</div>
            <div className="text-primary-foreground/70 font-body text-sm md:text-base">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactSection;
