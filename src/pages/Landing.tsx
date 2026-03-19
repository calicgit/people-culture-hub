import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroLanding from "@/components/landing/HeroLanding";
import NewsSection from "@/components/landing/NewsSection";
import AboutSection from "@/components/landing/AboutSection";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import MembershipSection from "@/components/landing/MembershipSection";
import ContactSection from "@/components/landing/ContactSection";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => (
  <div className="min-h-screen">
    <LandingNavbar />
    <HeroLanding />
    <NewsSection />
    <AboutSection />
    <WhatWeDoSection />
    <MembershipSection />
    <ContactSection />
    <LandingFooter />
  </div>
);

export default Landing;
