import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t("Poruka poslana!", "Message Sent!"),
        description: t("Javit ćemo vam se u najkraćem roku.", "We'll get back to you shortly."),
      });
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <section id="kontakt" className="py-20 bg-warm-gray">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            {t("Kontakt", "Contact")}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {t("Stupite u kontakt", "Get in Touch")}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">Email</h4>
                <p className="text-muted-foreground text-sm font-body">hub@peopleandculture.hr</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">{t("Telefon", "Phone")}</h4>
                <p className="text-muted-foreground text-sm font-body">+385 1 234 5678</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">{t("Adresa", "Address")}</h4>
                <p className="text-muted-foreground text-sm font-body">
                  {t("Ilica 1, 10000 Zagreb, Hrvatska", "Ilica 1, 10000 Zagreb, Croatia")}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-card rounded-xl border border-border p-6 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{t("Ime i prezime", "Full Name")}</Label>
                <Input required placeholder={t("Vaše ime", "Your name")} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input required type="email" placeholder={t("vaš@email.hr", "your@email.com")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t("Predmet", "Subject")}</Label>
              <Input required placeholder={t("O čemu se radi?", "What is this about?")} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Poruka", "Message")}</Label>
              <Textarea required rows={4} placeholder={t("Vaša poruka...", "Your message...")} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Send size={16} className="mr-2" />
              {loading ? t("Šaljem...", "Sending...") : t("Pošalji poruku", "Send Message")}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
