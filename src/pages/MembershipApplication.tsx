
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const REFERRAL_OPTIONS = [
  "Antonija Kapović",
  "Bruna Kostelac Košir",
  "Dunja Vorkapić",
  "Maja Darija Škrljak",
  "Marija Felkel",
  "Mirela Kotarac",
  "Romina Ivančić Maćešić",
  "Slavica Gunjević Golubović",
  "Szabolcs Annus",
  "Tanja Pureta",
  "Tome Barić",
  "Vjekoslav Golubović",
  "Tina Balenović",
  "Iva Taiber",
  "NITKO",
];

const TOTAL_STEPS = 9;

const MembershipApplication = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [membershipTier, setMembershipTier] = useState("");
  const [referrals, setReferrals] = useState<string[]>([]);
  const [howHeard, setHowHeard] = useState("");
  const [paidBy, setPaidBy] = useState("");

  // Payment details
  const [payerCompanyName, setPayerCompanyName] = useState("");
  const [payerFullName, setPayerFullName] = useState("");
  const [payerAddress, setPayerAddress] = useState("");
  const [payerOib, setPayerOib] = useState("");
  const [applicantOib, setApplicantOib] = useState("");
  const [applicantDob, setApplicantDob] = useState("");
  const [invoiceEmail, setInvoiceEmail] = useState("");

  // Personal payment
  const [personalFullName, setPersonalFullName] = useState("");
  const [personalAddress, setPersonalAddress] = useState("");
  const [personalOib, setPersonalOib] = useState("");
  const [personalDob, setPersonalDob] = useState("");
  const [personalInvoiceEmail, setPersonalInvoiceEmail] = useState("");

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return true; // consent handled by button
      case 3: return firstName.trim() && lastName.trim() && phone.trim() && email.trim() && email.includes("@");
      case 4: return !!membershipTier;
      case 5: return referrals.length > 0;
      case 6: return true; // optional
      case 7: return !!paidBy;
      case 8:
        if (paidBy === "employer") {
          return payerCompanyName.trim() && payerFullName.trim() && payerAddress.trim() && payerOib.trim() && applicantOib.trim() && applicantDob && invoiceEmail.trim();
        } else {
          return personalFullName.trim() && personalAddress.trim() && personalOib.trim() && personalDob && personalInvoiceEmail.trim();
        }
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isEmployer = paidBy === "employer";
      const { error } = await supabase.from("membership_applications").insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        company: company.trim() || null,
        membership_tier: membershipTier,
        referrals,
        how_heard: howHeard.trim() || null,
        paid_by: paidBy,
        payer_company_name: isEmployer ? payerCompanyName.trim() : null,
        payer_full_name: isEmployer ? payerFullName.trim() : personalFullName.trim(),
        payer_address: isEmployer ? payerAddress.trim() : personalAddress.trim(),
        payer_oib: isEmployer ? payerOib.trim() : null,
        applicant_oib: isEmployer ? applicantOib.trim() : personalOib.trim(),
        applicant_date_of_birth: isEmployer ? applicantDob : personalDob,
        invoice_email: isEmployer ? invoiceEmail.trim() : personalInvoiceEmail.trim(),
      } as any);

      if (error) throw error;

      // Send notification email
      try {
        await supabase.functions.invoke("send-membership-notification", {
          body: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            company: company.trim(),
            membershipTier,
            referrals,
            howHeard: howHeard.trim(),
            paidBy,
          },
        });
      } catch {
        // Email is best-effort
      }

      setStep(9);
    } catch (err: any) {
      toast.error("Greška pri slanju prijave. Pokušajte ponovo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 7 && paidBy) {
      setStep(8);
    } else if (step === 8) {
      handleSubmit();
    } else {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const toggleReferral = (name: string) => {
    if (name === "NITKO") {
      setReferrals(referrals.includes("NITKO") ? [] : ["NITKO"]);
      return;
    }
    setReferrals((prev) => {
      const filtered = prev.filter((r) => r !== "NITKO");
      return filtered.includes(name) ? filtered.filter((r) => r !== name) : [...filtered, name];
    });
  };

  // Progress percentage
  const progress = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground py-4 px-6 flex items-center justify-between">
        <Link to="/" className="text-sm opacity-80 hover:opacity-100 flex items-center gap-1">
          <ArrowLeft size={16} /> Natrag
        </Link>
        <span className="font-heading text-sm font-medium">People & Culture HUB</span>
      </div>

      {/* Progress bar */}
      {step < 9 && (
        <div className="w-full h-1 bg-secondary-foreground/10">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Form content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Welcome */}
              {step === 1 && (
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-secondary-foreground">
                      Poštovani/a,
                    </h1>
                    <p className="text-secondary-foreground/80 font-body text-lg leading-relaxed">
                      molimo Vas da odgovorite na nekoliko pitanja kako bi uspješno zaprimili Vašu prijavu!
                    </p>
                    <p className="text-secondary-foreground/80 font-body text-lg">
                      Unaprijed hvala, <strong>People & Culture HUB!</strong>
                    </p>
                  </div>
                  <Button size="lg" onClick={() => setStep(2)} className="text-lg px-10 py-6">
                    Prijavi se!
                  </Button>
                </div>
              )}

              {/* Step 2: GDPR Consent */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-bold text-secondary-foreground">
                    SUGLASNOST ZA OBRADU PODATAKA <span className="text-destructive">*</span>
                  </h2>
                  <p className="text-secondary-foreground/80 font-body text-sm">
                    Sudjelovanjem u ovom upitniku potvrđujem da:
                  </p>
                  <ul className="space-y-3 text-secondary-foreground/80 font-body text-sm">
                    {[
                      "Razumijem da će moje sudjelovanje uključivati online upitnik u trajanju do 5 minuta.",
                      "Razumijem da je moje sudjelovanje u potpunosti dobrovoljno.",
                      "Razumijem da se mogu povući u bilo kojem trenutku, bez navođenja razloga i bez ikakvih posljedica.",
                      "Razumijem da će moji osobni podaci biti korišteni isključivo za potrebe ovog upitnika i prijave u People & Culture HUB udrugu.",
                      "Imam mogućnost kontaktirati službenika za obradu osobnih podataka (hub@peopleandculture.hr) u slučaju bilo kakvih dodatnih pitanja ili nejasnoća.",
                      "Razumijem da mogu kontaktirati nadležno tijelo za etička pitanja ako imam dvojbe u vezi s provođenjem upitnika.",
                      "Informiran/a sam o svojim pravima u skladu s Općom uredbom o zaštiti podataka (GDPR), uključujući pravo na pristup, ispravak, povlačenje privole, brisanje podataka i pritužbu nadzornom tijelu (AZOP).",
                      "Razumijem da preporuka nije uvjet za učlanjenje, niti daje prednost u proces, već služi isključivo za bržu obradu podataka navedenih u prijavnici.",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-secondary-foreground/70 font-body text-xs italic">
                    Klikom na gumb "Prihvaćam" potvrđujem da sam razumio/la gore navedene informacije i pristajem sudjelovati u upitniku.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => setStep(3)} className="flex-1">
                      Prihvaćam
                    </Button>
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                      Ne prihvaćam
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Personal Info */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-secondary-foreground">
                      Osobni podaci <span className="text-destructive">*</span>
                    </h2>
                    <p className="text-secondary-foreground/70 font-body text-sm mt-1">
                      Upišite email adresu i broj telefona s kojih želite komunicirati prilikom sudjelovanja u People & Culture HUB udruzi
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-secondary-foreground">Ime <span className="text-destructive">*</span></Label>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground">Prezime <span className="text-destructive">*</span></Label>
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground">Telefonski broj <span className="text-destructive">*</span></Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground">Adresa e-pošte <span className="text-destructive">*</span></Label>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground">Kompanija</Label>
                      <Input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <Button onClick={nextStep} disabled={!canProceed()} className="w-full">
                    U redu
                  </Button>
                </div>
              )}

              {/* Step 4: Membership Type */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-secondary-foreground">
                      Vrsta članstva <span className="text-destructive">*</span>
                    </h2>
                    <p className="text-secondary-foreground/70 font-body text-sm mt-1">
                      Molimo odaberite vrstu članstva za koje se prijavljujete. Ako se prijavljujete kao privatna osoba, odaberite opcije Basic ili Advanced. Ako se prijavljujete kao student, odaberite opciju Student.
                    </p>
                  </div>
                  <RadioGroup value={membershipTier} onValueChange={setMembershipTier} className="space-y-3">
                    {[
                      { value: "student", label: "Student članstvo", price: "30€ godišnje", desc: "namijenjeno redovnim studentima" },
                      { value: "basic", label: "Basic članstvo", price: "120€ godišnje", desc: "" },
                      { value: "advanced", label: "Advanced članstvo", price: "170€ godišnje", desc: "namijenjeno članovima vijeća, odbora ili drugih tijela udruge" },
                    ].map((tier) => (
                      <label
                        key={tier.value}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          membershipTier === tier.value
                            ? "border-primary bg-primary/10"
                            : "border-secondary-foreground/20 hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={tier.value} className="mt-0.5" />
                        <div>
                          <span className="font-heading font-semibold text-secondary-foreground">
                            {tier.label} — {tier.price}
                          </span>
                          {tier.desc && (
                            <p className="text-secondary-foreground/60 text-xs mt-0.5">({tier.desc})</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                  <Button onClick={nextStep} disabled={!canProceed()} className="w-full">
                    U redu
                  </Button>
                </div>
              )}

              {/* Step 5: Referral */}
              {step === 5 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-secondary-foreground">
                      Preporuka <span className="text-destructive">*</span>
                    </h2>
                    <p className="text-secondary-foreground/70 font-body text-sm mt-1">
                      Radi učinkovitije obrade prijava, udruga omogućuje članovima osnivačima da preporuče nove kandidate. Preporuka nije uvjet za učlanjenje, niti daje prednost u proces, već služi isključivo tome da brže potvrdimo podatke navedene u prijavnici.
                    </p>
                    <p className="text-secondary-foreground/70 font-body text-sm mt-2">
                      Ukoliko ne postoji takva osoba, molimo odaberite <strong>NITKO</strong>.
                    </p>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {REFERRAL_OPTIONS.map((name) => (
                      <label
                        key={name}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          referrals.includes(name)
                            ? "border-primary bg-primary/10"
                            : "border-secondary-foreground/20 hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          checked={referrals.includes(name)}
                          onCheckedChange={() => toggleReferral(name)}
                        />
                        <span className={`font-body text-sm ${name === "NITKO" ? "font-semibold" : ""} text-secondary-foreground`}>
                          {name}
                        </span>
                      </label>
                    ))}
                  </div>
                  <Button onClick={nextStep} disabled={!canProceed()} className="w-full">
                    U redu
                  </Button>
                </div>
              )}

              {/* Step 6: How did you hear */}
              {step === 6 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-bold text-secondary-foreground">
                    Gdje ste saznali za People & Culture HUB udrugu?
                  </h2>
                  <Textarea
                    value={howHeard}
                    onChange={(e) => setHowHeard(e.target.value)}
                    placeholder="Vaš odgovor..."
                    className="min-h-[100px]"
                  />
                  <Button onClick={nextStep} className="w-full">
                    U redu
                  </Button>
                </div>
              )}

              {/* Step 7: Who pays */}
              {step === 7 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-bold text-secondary-foreground">
                    Članarinu plaća <span className="text-destructive">*</span>
                  </h2>
                  <RadioGroup value={paidBy} onValueChange={setPaidBy} className="space-y-3">
                    {[
                      { value: "employer", label: "Poslodavac" },
                      { value: "personal", label: "Osobno" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          paidBy === opt.value
                            ? "border-primary bg-primary/10"
                            : "border-secondary-foreground/20 hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={opt.value} />
                        <span className="font-heading font-semibold text-secondary-foreground">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  <Button onClick={nextStep} disabled={!canProceed()} className="w-full">
                    U redu
                  </Button>
                </div>
              )}

              {/* Step 8: Payment details */}
              {step === 8 && paidBy === "employer" && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-secondary-foreground">
                      Podaci za plaćanje — Poslodavac <span className="text-destructive">*</span>
                    </h2>
                    <p className="text-secondary-foreground/70 font-body text-sm mt-1">
                      Ukoliko članarinu plaća poslodavac, molimo upišite podatke:
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Naziv tvrtke <span className="text-destructive">*</span></Label>
                      <Input value={payerCompanyName} onChange={(e) => setPayerCompanyName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Ime i prezime <span className="text-destructive">*</span></Label>
                      <Input value={payerFullName} onChange={(e) => setPayerFullName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Adresa poslodavca <span className="text-destructive">*</span></Label>
                      <Input value={payerAddress} onChange={(e) => setPayerAddress(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">OIB poslodavca <span className="text-destructive">*</span></Label>
                      <Input value={payerOib} onChange={(e) => setPayerOib(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Vaš OIB <span className="text-destructive">*</span></Label>
                      <Input value={applicantOib} onChange={(e) => setApplicantOib(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Vaš datum rođenja <span className="text-destructive">*</span></Label>
                      <Input value={applicantDob} onChange={(e) => setApplicantDob(e.target.value)} type="date" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">E-mail na koji se šalje ponuda <span className="text-destructive">*</span></Label>
                      <Input value={invoiceEmail} onChange={(e) => setInvoiceEmail(e.target.value)} type="email" className="mt-1" />
                    </div>
                  </div>
                  <Button onClick={handleSubmit} disabled={!canProceed() || loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                    U redu
                  </Button>
                </div>
              )}

              {step === 8 && paidBy === "personal" && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-secondary-foreground">
                      Podaci za plaćanje — Osobno <span className="text-destructive">*</span>
                    </h2>
                    <p className="text-secondary-foreground/70 font-body text-sm mt-1">
                      Ukoliko članarinu plaćate osobno, molimo upišite podatke:
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Ime i prezime <span className="text-destructive">*</span></Label>
                      <Input value={personalFullName} onChange={(e) => setPersonalFullName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Vaša adresa prebivališta <span className="text-destructive">*</span></Label>
                      <Input value={personalAddress} onChange={(e) => setPersonalAddress(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Vaš OIB <span className="text-destructive">*</span></Label>
                      <Input value={personalOib} onChange={(e) => setPersonalOib(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">Vaš datum rođenja <span className="text-destructive">*</span></Label>
                      <Input value={personalDob} onChange={(e) => setPersonalDob(e.target.value)} type="date" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-secondary-foreground text-xs uppercase tracking-wide">E-mail na koji se šalje ponuda <span className="text-destructive">*</span></Label>
                      <Input value={personalInvoiceEmail} onChange={(e) => setPersonalInvoiceEmail(e.target.value)} type="email" className="mt-1" />
                    </div>
                  </div>
                  <Button onClick={handleSubmit} disabled={!canProceed() || loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                    Pošalji
                  </Button>
                </div>
              )}

              {/* Step 9: Thank you */}
              {step === 9 && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Check className="text-primary" size={32} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-secondary-foreground">
                    Hvala na prijavi!
                  </h2>
                  <p className="text-secondary-foreground/80 font-body text-lg">
                    Kontaktirati ćemo Vas ubrzo!
                  </p>
                  <p className="font-heading text-lg font-semibold text-primary">
                    People & Culture HUB
                  </p>
                  <Link to="/">
                    <Button variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                      Natrag na početnu
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Back button for steps 3-8 */}
          {step >= 3 && step <= 8 && (
            <button
              onClick={prevStep}
              className="mt-6 flex items-center gap-1 text-secondary-foreground/60 hover:text-secondary-foreground text-sm font-body mx-auto"
            >
              <ArrowLeft size={14} /> Natrag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipApplication;
