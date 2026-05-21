import Image from "next/image";
import Link from "next/link";

// --- Types ---
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

// --- Styles ---
const footerBaseClasses =
  "w-full bg-[color:var(--color-gray-50,#f9f9f9)] border-t border-[color:var(--color-gray-200,#e5e5ec)]";

const getFooterClasses = (className?: string) =>
  [footerBaseClasses, className].filter(Boolean).join(" ");

const contentClasses = "mx-auto max-w-[1440px] py-5";

const infoTextClasses =
  "text-[14px] leading-[1.6] tracking-[-0.35px] text-[color:var(--color-gray-500,#808080)]";

const linkClasses =
  "underline text-[14px] font-bold leading-[1.6] tracking-[-0.35px] text-[color:var(--color-gray-500,#808080)] hover:text-[color:var(--color-gray-700,#666)] transition-colors";

const copyrightClasses = "text-[12px] leading-[1.6] text-[color:var(--color-gray-400,#b3b3b3)]";

// --- Default Values ---
const DEFAULT_LINKS: FooterLink[] = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "사이트맵", href: "/sitemap" },
];

const DEFAULT_ADDRESS = "16499 경기도 수원시 영통구 월드컵로 206 아주대학교";
const DEFAULT_PHONE = "T. 031-219-2114";
const DEFAULT_COPYRIGHT = "© 2025 AJOU University. All rights reserved.";

// --- Component ---
export const Footer = ({
  links = DEFAULT_LINKS,
  address = DEFAULT_ADDRESS,
  phone = DEFAULT_PHONE,
  copyright = DEFAULT_COPYRIGHT,
  className,
}: FooterProps) => {
  const footerClasses = getFooterClasses(className);

  return (
    <footer className={footerClasses}>
      <div className={contentClasses}>
        <div className="flex items-end justify-between gap-6 flex-col sm:flex-row">
          {/* Left: Logo + Info */}
          <div className="flex items-center gap-10 flex-col sm:flex-row">
            {/* Ajou Logo */}
            <div className="relative shrink-0 h-15 w-58">
              <Image
                src="/assets/ajou-logo-text.svg"
                alt="Ajou University Logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              {/* Policy Links */}
              <div className="flex items-center gap-4 flex-wrap">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Address & Copyright */}
              <div className={infoTextClasses}>
                <p>{address}</p>
                <p>{phone}</p>
                <p className={copyrightClasses}>{copyright}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
