import Link from "next/link";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterProps = {
  links?: FooterLink[];
  address?: string;
  phone?: string;
  copyright?: string;
  className?: string;
};

const DEFAULT_LINKS: FooterLink[] = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "사이트맵", href: "/sitemap" },
];

const DEFAULT_ADDRESS = "16499 경기도 수원시 영통구 월드컵로 206 아주대학교";
const DEFAULT_PHONE = "T. 031-219-2114";
const DEFAULT_COPYRIGHT = "Copyright © 2024 Ajou University. All Rights Reserved.";

const InstagramIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

export const Footer = ({
  links = DEFAULT_LINKS,
  address = DEFAULT_ADDRESS,
  phone = DEFAULT_PHONE,
  copyright = DEFAULT_COPYRIGHT,
  className,
}: FooterProps) => {
  return (
    <footer
      className={["w-full bg-[#f9f9f9] border-t border-[#e5e5e5]", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex h-50 max-w-360 items-center">
        <div className="flex w-full items-end justify-between gap-5">
          {/* Left: Logo + Info */}
          <div className="flex items-center gap-10">
            {/* Ajou Logo */}
            <img
              src="/assets/ajou-logo-text.svg"
              alt="Ajou University"
              className="h-15 w-58 shrink-0 object-contain"
            />

            {/* Info */}
            <div className="flex flex-col gap-5">
              {/* Policy Links */}
              <div className="flex items-center gap-4 flex-wrap">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="underline text-[16px] leading-normal tracking-[-0.4px] text-[#808080] hover:text-[#555] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Address & Copyright */}
              <p className="text-[16px] leading-normal tracking-[-0.4px] text-[#808080] whitespace-nowrap">
                {address}
                <br />
                {phone}
                <br />
                {copyright}
              </p>
            </div>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="인스타그램"
              className="text-[#808080] hover:text-[#555] transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="페이스북"
              className="text-[#808080] hover:text-[#555] transition-colors"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="유튜브"
              className="text-[#808080] hover:text-[#555] transition-colors"
            >
              <YoutubeIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
