export const KORYXA_CONTACT = {
  email: "contact.koryxa@gmail.com",
  phoneDisplay: "+228 92 09 25 72",
  phoneWa: "22892092572",
  whatsappUrl: "https://wa.me/22892092572?text=Bonjour%20KORYXA%2C%20je%20souhaite%20vous%20contacter.",
  facebookUrl: "https://www.facebook.com/profile.php?id=61588408132915",
  linkedinUrl: "https://www.linkedin.com/company/107221300/",
} as const;

export const KORYXA_CONTACT_LINKS = [
  {
    key: "facebook",
    label: "Facebook",
    href: KORYXA_CONTACT.facebookUrl,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: KORYXA_CONTACT.linkedinUrl,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: KORYXA_CONTACT.whatsappUrl,
  },
  {
    key: "email",
    label: "Email",
    href: `mailto:${KORYXA_CONTACT.email}`,
  },
] as const;
