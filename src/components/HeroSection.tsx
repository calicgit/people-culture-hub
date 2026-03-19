import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-community.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImg} alt="Diverse community holding hands" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-charcoal/60" />
    </div>

    <div className="container relative z-10 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6">
          Bridging People & Cultures
        </span>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
          Empowering Communities Through{" "}
          <span className="text-primary">Culture</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg font-body">
          We connect people across cultures, foster understanding, and build stronger communities through dialogue, education, and shared experiences.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="text-base px-8">
            Our Programs
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            Donate Now
          </Button>
        </div>
      </motion.div>
    </div>

    <motion.a
      href="#about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-primary-foreground/60 hover:text-primary-foreground transition-colors animate-bounce"
    >
      <ArrowDown size={28} />
    </motion.a>
  </section>
);

export default HeroSection;
