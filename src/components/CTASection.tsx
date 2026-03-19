import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section id="contact" className="py-24 bg-sage-light">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
          Join the Movement
        </h2>
        <p className="text-muted-foreground text-lg mb-8 font-body">
          Whether you volunteer, donate, or simply spread the word — every action matters. Together, we can build a world where every culture is celebrated.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="text-base px-8">Volunteer With Us</Button>
          <Button size="lg" variant="outline" className="text-base px-8">Make a Donation</Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
