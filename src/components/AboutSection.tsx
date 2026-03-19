import { motion } from "framer-motion";
import { Heart, Globe, Users } from "lucide-react";

const values = [
  { icon: Heart, title: "Compassion", desc: "We lead with empathy, ensuring every voice is heard and every culture respected." },
  { icon: Globe, title: "Inclusivity", desc: "We celebrate diversity and create spaces where everyone belongs." },
  { icon: Users, title: "Community", desc: "We believe in the power of people coming together to create lasting change." },
];

const AboutSection = () => (
  <section id="about" className="py-24 bg-cream">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Mission</span>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
          Building Bridges, Not Walls
        </h2>
        <p className="text-muted-foreground text-lg font-body">
          People & Culture HUB is a non-profit organization dedicated to fostering cross-cultural understanding, empowering marginalized communities, and creating platforms for meaningful dialogue.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="bg-card rounded-2xl p-8 text-center border border-border hover:shadow-lg transition-shadow"
          >
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-5">
              <v.icon className="w-7 h-7 text-accent-foreground" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{v.title}</h3>
            <p className="text-muted-foreground font-body">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
