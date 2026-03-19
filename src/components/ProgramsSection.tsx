import { motion } from "framer-motion";
import workshopImg from "@/assets/program-workshop.jpg";
import cultureImg from "@/assets/program-culture.jpg";
import youthImg from "@/assets/program-youth.jpg";

const programs = [
  { img: workshopImg, title: "Community Workshops", desc: "Interactive sessions that bring people together to share stories, skills, and traditions across cultural boundaries." },
  { img: cultureImg, title: "Cultural Exchange", desc: "Events celebrating diverse traditions through food, art, music, and storytelling from communities around the world." },
  { img: youthImg, title: "Youth Empowerment", desc: "Mentorship and leadership programs designed to equip young people with the tools to become agents of change." },
];

const ProgramsSection = () => (
  <section id="programs" className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <span className="text-primary font-medium text-sm uppercase tracking-wider">What We Do</span>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mt-3">Our Programs</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {programs.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all"
          >
            <div className="overflow-hidden h-56">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProgramsSection;
