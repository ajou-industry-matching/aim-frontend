import { ExternalLinkIcon } from "@/shared/ui/icons";

export type PolicyPageProps = {
  title: string;
  description: string;
  externalUrl: string;
  externalLinkLabel: string;
};

export const PolicyPage = ({
  title,
  description,
  externalUrl,
  externalLinkLabel,
}: PolicyPageProps): React.ReactElement => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-16 md:px-16">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-6">
        <header>
          <h1 className="text-[32px] font-bold leading-tight text-gray-900">{title}</h1>
        </header>
        <p className="max-w-[560px] text-[16px] leading-6 text-gray-600">{description}</p>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 w-fit items-center gap-2 rounded-lg bg-[var(--color-primary-800)] px-8 text-[16px] font-medium text-white transition-colors hover:bg-[var(--color-primary-700)]"
        >
          {externalLinkLabel}
          <ExternalLinkIcon size={18} />
        </a>
      </div>
    </main>
  );
};
