import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { supabase } from "@/integrations/supabase/client";

type TeamMember = {
  id: string;
  full_name: string;
  council: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
};

const councilOrder = ["upravno_vijece", "savjetodavno_vijece", "znanstveno_vijece"] as const;

const councilLabels: Record<string, { hr: string; en: string }> = {
  upravno_vijece: { hr: "Upravno vijeće", en: "Executive Board" },
  savjetodavno_vijece: { hr: "Savjetodavno vijeće", en: "Advisory Board" },
  znanstveno_vijece: { hr: "Znanstveno vijeće", en: "Scientific Board" },
};

const Team = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("team_members" as never)
        .select("*")
        .order("display_order", { ascending: true });
      if (data) setMembers(data as unknown as TeamMember[]);
      setLoading(false);
    };
    void load();
  }, []);

  const membersByCouncil = councilOrder.map((council) => ({
    council,
    label: councilLabels[council],
    members: members.filter((m) => m.council === council),
  }));

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="container relative">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-secondary-foreground/70 hover:text-secondary-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Početna", "Home")}
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-xl md:text-3xl font-bold mb-4"
          >
            {t("Tim People & Culture HUB-a", "People & Culture HUB Team")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary-foreground/80 max-w-2xl font-body"
          >
            {t(
              "Upoznajte članove Upravnog, Savjetodavnog i Znanstvenog vijeća naše Udruge.",
              "Meet the members of our association's Executive, Advisory and Scientific boards."
            )}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container space-y-20">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">
              {t("Učitavanje...", "Loading...")}
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              {t(
                "Članovi tima će uskoro biti objavljeni.",
                "Team members will be published soon."
              )}
            </div>
          ) : (
            membersByCouncil
              .filter((g) => g.members.length > 0)
              .map((group, gi) => (
                <div key={group.council}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.1 }}
                    className="mb-10"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-6 w-6 text-primary" />
                      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                        {t(group.label.hr, group.label.en)}
                      </h2>
                    </div>
                    <div className="h-1 w-16 bg-primary rounded-full" />
                  </motion.div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-5xl">
                    {group.members.map((member, mi) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: mi * 0.05 }}
                        className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-[3/4] bg-muted overflow-hidden flex items-center justify-center">
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt={member.full_name}
                              className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-accent">
                              <Users className="h-16 w-16 text-accent-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-heading text-lg font-semibold text-foreground">
                            {member.full_name}
                          </h3>
                          {member.title && (
                            <p className="text-sm text-primary font-medium">
                              {member.title}
                            </p>
                          )}
                          {member.bio && (
                            <p className="mt-3 text-sm text-muted-foreground font-body leading-relaxed">
                              {member.bio}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Team;
