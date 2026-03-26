
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      membershipTier,
      referrals,
      howHeard,
      paidBy,
    } = await req.json();

    const tierLabels: Record<string, string> = {
      student: "Student (30€/god)",
      basic: "Basic (120€/god)",
      advanced: "Advanced (170€/god)",
    };

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    // Build email body
    const htmlBody = `
      <h2>Nova prijava za članstvo - People & Culture HUB</h2>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Ime i prezime</td><td style="padding:8px;border:1px solid #ddd;">${firstName} ${lastName}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Telefon</td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Kompanija</td><td style="padding:8px;border:1px solid #ddd;">${company || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Vrsta članstva</td><td style="padding:8px;border:1px solid #ddd;">${tierLabels[membershipTier] || membershipTier}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Preporuka</td><td style="padding:8px;border:1px solid #ddd;">${(referrals || []).join(", ") || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Kako je saznao/la</td><td style="padding:8px;border:1px solid #ddd;">${howHeard || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Članarinu plaća</td><td style="padding:8px;border:1px solid #ddd;">${paidBy === "employer" ? "Poslodavac" : "Osobno"}</td></tr>
      </table>
    `;

    if (RESEND_API_KEY) {
      // Use Resend if configured
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "People & Culture HUB <noreply@peopleandculture.hr>",
          to: ["hub@peopleandculture.hr"],
          subject: `Nova prijava za članstvo: ${firstName} ${lastName}`,
          html: htmlBody,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Resend error:", errorText);
      }
    } else {
      // Fallback: log to console (email will be sent when Resend is configured)
      console.log("Email notification (no RESEND_API_KEY configured):");
      console.log("To: hub@peopleandculture.hr");
      console.log("Subject:", `Nova prijava za članstvo: ${firstName} ${lastName}`);
      console.log("Body:", htmlBody);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
