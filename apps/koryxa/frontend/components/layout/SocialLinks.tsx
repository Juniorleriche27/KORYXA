import type { SVGProps } from "react";
import { KORYXA_CONTACT_LINKS } from "@/config/contact";

type SocialKey = (typeof KORYXA_CONTACT_LINKS)[number]["key"];

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.04 3.69 9.22 8.52 9.98v-7.06H7.99v-2.92h2.53V9.84c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.92h-2.34v7.06C18.31 21.28 22 17.1 22 12.06Z"
      />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z"
      />
    </svg>
  );
}

function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20.52 3.48A11.83 11.83 0 0 0 12.1 0C5.56 0 .23 5.32.23 11.87c0 2.09.55 4.13 1.6 5.93L0 24l6.36-1.67a11.9 11.9 0 0 0 5.73 1.46h.01c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.23-6.15-3.45-8.44ZM12.1 21.79h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.22-3.77.99 1-3.67-.24-.38a9.86 9.86 0 0 1-1.51-5.26C2.19 6.41 6.64 1.96 12.1 1.96a9.84 9.84 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.9 7.06c0 5.47-4.44 9.87-9.89 9.87Zm5.42-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

function EmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M3.75 5.25h16.5A2.75 2.75 0 0 1 23 8v8a2.75 2.75 0 0 1-2.75 2.75H3.75A2.75 2.75 0 0 1 1 16V8a2.75 2.75 0 0 1 2.75-2.75Zm.33 2 7.1 5.24c.49.36 1.15.36 1.64 0l7.1-5.24H4.08Zm16.92 1.48-6.99 5.16a3.42 3.42 0 0 1-4.02 0L3 8.73V16c0 .41.34.75.75.75h16.5c.41 0 .75-.34.75-.75V8.73Z"
      />
    </svg>
  );
}

function SocialIcon({ type, className }: { type: SocialKey; className?: string }) {
  if (type === "facebook") return <FacebookIcon className={className} />;
  if (type === "linkedin") return <LinkedinIcon className={className} />;
  if (type === "whatsapp") return <WhatsappIcon className={className} />;
  return <EmailIcon className={className} />;
}

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid gap-3 sm:grid-cols-2"}>
      {KORYXA_CONTACT_LINKS.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
          aria-label={link.label}
          className={
            compact
              ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4f2ea] bg-white text-[#006b43] shadow-[0_10px_24px_rgba(0,107,67,0.08)] transition hover:-translate-y-0.5 hover:border-[#00a86b] hover:text-[#00a86b]"
              : "group inline-flex items-center gap-3 rounded-2xl border border-[#e4f2ea] bg-white px-4 py-3 text-sm font-semibold text-[#17231d] shadow-[0_12px_30px_rgba(0,107,67,0.07)] transition hover:-translate-y-0.5 hover:border-[#00a86b] hover:text-[#006b43]"
          }
        >
          <SocialIcon type={link.key} className={compact ? "h-5 w-5" : "h-5 w-5 text-[#006b43] group-hover:text-[#00a86b]"} />
          {compact ? null : <span>{link.label}</span>}
        </a>
      ))}
    </div>
  );
}
