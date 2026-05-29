"use client";

import type { PortfolioBoardType } from "@/api/posts";

export type PortfolioTypeFilterProps = {
  selectedTypes: PortfolioBoardType[];
  onChange: (next: PortfolioBoardType[]) => void;
};

type PortfolioTypeChip = {
  label: string;
  value: PortfolioBoardType;
};

const portfolioTypeChips: PortfolioTypeChip[] = [
  { label: "개인", value: "PORTFOLIO" },
  { label: "기업", value: "COMPANY_PROJECT" },
  { label: "연구실", value: "LAB_INTERN" },
];

const chipBaseClasses =
  "h-9 rounded-full px-4 py-[6px] text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors";

const chipActiveClasses =
  "border border-[var(--color-primary-800,#004a9c)] bg-[var(--color-primary-800,#004a9c)] text-white";

const chipInactiveClasses =
  "border border-[var(--color-gray-200,#e5e5e5)] text-[var(--color-gray-700,#4d4d4d)] hover:border-[var(--color-primary-800,#004a9c)] hover:text-[var(--color-primary-800,#004a9c)]";

const getChipClasses = (isActive: boolean): string =>
  [chipBaseClasses, isActive ? chipActiveClasses : chipInactiveClasses].join(" ");

const toggleType = (
  current: PortfolioBoardType[],
  target: PortfolioBoardType,
): PortfolioBoardType[] =>
  current.includes(target) ? current.filter((type) => type !== target) : [...current, target];

export const PortfolioTypeFilter = ({ selectedTypes, onChange }: PortfolioTypeFilterProps) => {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="포트폴리오 유형 필터"
    >
      {portfolioTypeChips.map((chip) => {
        const isActive = selectedTypes.includes(chip.value);
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onChange(toggleType(selectedTypes, chip.value))}
            className={getChipClasses(isActive)}
            aria-pressed={isActive}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};
