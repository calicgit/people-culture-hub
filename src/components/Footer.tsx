import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-charcoal py-16">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="font-heading text-xl font-bold text-primary-foreground mb-4">
            People & Culture <span className="text-primary">HUB</span>
          </h3>
          <p className="text-primary-foreground/60 font-body text-sm leading-relaxed">
            Empowering communities through cultural understanding, dialogue, and shared humanity.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-primary-foreground uppercase tracking-wider mb-4">Quick Links</h4>
          <div className="space-y-2">
            {["About", "Programs", "Impact", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="block text-primary-foreground/60 hover:text-primary transition-colors text-sm font-body">
                {l}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-primary-foreground uppercase tracking-wider mb-4">Contact</h4>
          <div className="space-y-3 text-primary-foreground/60 text-sm font-body">
            <div className="flex items-center gap-2"><Mail size={16} /> info@peopleculturehub.org</div>
            <div className="flex items-center gap-2"><Phone size={16} /> +1 (555) 123-4567</div>
            <div className="flex items-center gap-2"><MapPin size={16} /> 123 Community Lane</div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-8 text-center text-primary-foreground/40 text-sm font-body">
        © {new Date().getFullYear()} People & Culture HUB. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
