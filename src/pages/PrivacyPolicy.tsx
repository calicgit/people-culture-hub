import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col">
    <LandingNavbar />
    <main className="flex-1 pt-20">
      <section className="py-16">
        <div className="container max-w-3xl space-y-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Politika privatnosti
          </h1>

          <div className="space-y-8 text-muted-foreground font-body text-sm leading-relaxed">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">Tko smo mi</h2>
              <p>Adresa naše web stranice je: <a href="/" className="text-primary hover:underline">hub.peopleandculture.hr</a></p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">Komentari</h2>
              <p>Kada posjetitelji ostave komentare na web mjestu, prikupljamo podatke prikazane u obrascu za komentare, kao i IP adresu posjetitelja i niz korisničkog agenta preglednika kako bismo pomogli u otkrivanju neželjene pošte.</p>
              <p className="mt-3">Anonimizirani niz stvoren iz vaše adrese e-pošte (koji se naziva i hash) može se dostaviti usluzi Gravatar kako bi se vidjelo koristite li ga. Pravila o privatnosti usluge Gravatar dostupna su ovdje: <a href="https://automattic.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://automattic.com/privacy/</a>. Nakon odobrenja vašeg komentara, vaša profilna slika vidljiva je javnosti u kontekstu vašeg komentara.</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">Sadržaj</h2>
              <p>Ako prenosite slike na web stranicu, trebali biste izbjegavati učitavanje slika s ugrađenim podacima o lokaciji (EXIF GPS). Posjetitelji web stranice mogu preuzeti i izdvojiti sve podatke o lokaciji sa slika na web stranici uz eksplicitno dopuštenje autoriteta nadležnog za navedenu stranicu. Za više informacija molimo Vas da se obratite na <a href="mailto:hub@peopleandculture.hr" className="text-primary hover:underline">hub@peopleandculture.hr</a>.</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">Kolačići</h2>
              <p>Ako ostavite komentar na našoj web stranici, možete se odlučiti za spremanje svog imena, adrese e-pošte i web stranice u kolačiće. Ovo je za vašu udobnost kako ne biste morali ponovno ispunjavati svoje podatke kada ostavite drugi komentar. Ovi kolačići će trajati godinu dana.</p>
              <p className="mt-3">Ako posjetite našu stranicu za prijavu, postavit ćemo privremeni kolačić kako bismo utvrdili prihvaća li vaš preglednik kolačiće. Ovaj kolačić ne sadrži osobne podatke i odbacuje se kada zatvorite preglednik.</p>
              <p className="mt-3">Ako se prijavite, također ćemo postaviti nekoliko kolačića za spremanje vaših podataka za prijavu i izbora prikaza zaslona. Kolačići za prijavu traju dva dana, a kolačići s opcijama zaslona godinu dana. Ako odaberete "Zapamti me", vaša će prijava trajati dva tjedna. Ako se odjavite sa svog računa, kolačići za prijavu bit će uklonjeni.</p>
              <p className="mt-3">Ako uredite ili objavite članak, dodatni kolačić bit će spremljen u vaš preglednik. Ovaj kolačić ne sadrži osobne podatke i jednostavno označava ID objave članka koji ste upravo uredili. Istječe nakon 1 dana.</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">Ugrađeni sadržaj s drugih web stranica</h2>
              <p>Članci na ovoj stranici mogu sadržavati ugrađeni sadržaj (npr. videozapise, slike, članke itd.). Ugrađeni sadržaj s drugih web stranica ponaša se na potpuno isti način kao da je posjetitelj posjetio drugu web stranicu.</p>
              <p className="mt-3">Te web stranice mogu prikupljati podatke o vama, koristiti kolačiće, ugrađivati dodatno praćenje trećih strana i nadzirati vašu interakciju s tim ugrađenim sadržajem, uključujući praćenje vaše interakcije s ugrađenim sadržajem ako imate račun i prijavljeni ste na tu web stranicu.</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">S kim dijelimo vaše podatke</h2>
              <p>Ako zatražite ponovno postavljanje lozinke, vaša IP adresa bit će uključena u e-poštu za ponovno postavljanje.</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">Koliko dugo zadržavamo vaše podatke</h2>
              <p>Ako ostavite komentar, komentar i njegovi metapodaci zadržavaju se na neodređeno vrijeme. To je tako da možemo automatski prepoznati i odobriti sve naknadne komentare umjesto da ih držimo u redu za moderiranje.</p>
              <p className="mt-3">Za korisnike koji se registriraju na našoj web stranici (ako postoje), također pohranjujemo osobne podatke koje daju u svom korisničkom profilu. Svi korisnici mogu vidjeti, urediti ili izbrisati svoje osobne podatke u bilo kojem trenutku (osim što ne mogu promijeniti svoje korisničko ime). Administratori web-mjesta također mogu vidjeti i uređivati te podatke.</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">Koja prava imate nad svojim podacima</h2>
              <p>Ako imate račun na ovoj stranici ili ste ostavili komentare, možete zatražiti primanje izvezene datoteke osobnih podataka koje imamo o vama, uključujući sve podatke koje ste nam dali. Također možete zatražiti da izbrišemo sve osobne podatke koje imamo o vama. To ne uključuje podatke koje smo dužni čuvati u administrativne, pravne ili sigurnosne svrhe.</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">Gdje se šalju vaši podaci</h2>
              <p>Komentari posjetitelja mogu se provjeriti putem automatizirane usluge otkrivanja neželjene pošte.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <LandingFooter />
  </div>
);

export default PrivacyPolicy;
