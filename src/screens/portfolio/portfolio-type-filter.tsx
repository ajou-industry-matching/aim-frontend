"use client";

import { PORTFOLIO_BOARD_TYPES_ALL, type PortfolioBoardType } from "@/api/posts";

export type PortfolioTypeFilterProps = {
  selectedTypes: PortfolioBoardType[];
  onChange: (next: PortfolioBoardType[]) => void;
};

type PortfolioTypeChipValue = PortfolioBoardType | "ALL";

type PortfolioTypeChip = {
  label: string;
  value: PortfolioTypeChipValue;
};

const PORTFOLIO_BOARD_LABELS: Record<PortfolioBoardType, string> = {
  PORTFOLIO: "개인",
  COMPANY_PROJECT: "기업",
  LAB_INTERN: "연구실",
};

const portfolioTypeChips: PortfolioTypeChip[] = [
  { label: "전체", value: "ALL" },
  ...PORTFOLIO_BOARD_TYPES_ALL.map((value) => ({
    label: PORTFOLIO_BOARD_LABELS[value],
    value,
  })),
];

const filterLabelClasses =
  "text-[14px] font-medium text-[var(--color-gray-600,#666)] leading-[20px]";

const chipBaseClasses =
  "h-8 rounded-md px-4 text-[14px] font-medium leading-[20px] transition-colors";

const chipActiveClasses =
  "bg-[var(--color-primary-800,#004a9c)] text-white hover:bg-[var(--color-primary-900,#003d7a)]";

const chipInactiveClasses =
  "border border-[var(--color-gray-200,#e5e5e5)] text-[var(--color-gray-600,#666)] hover:border-[var(--color-primary-800,#004a9c)] hover:text-[var(--color-primary-800,#004a9c)]";

const getChipClasses = (isActive: boolean): string =>
  [chipBaseClasses, isActive ? chipActiveClasses : chipInactiveClasses].join(" ");

const toggleBoardType = (
  current: PortfolioBoardType[],
  target: PortfolioBoardType,
): PortfolioBoardType[] =>
  current.includes(target) ? current.filter((type) => type !== target) : [...current, target];

export const PortfolioTypeFilter = ({ selectedTypes, onChange }: PortfolioTypeFilterProps) => {
  const isAllActive = selectedTypes.length === 0;

  const handleChipClick = (value: PortfolioTypeChipValue) => {
    if (value === "ALL") {
      if (!isAllActive) onChange([]);
      return;
    }
    onChange(toggleBoardType(selectedTypes, value));
  };

  const isChipActive = (value: PortfolioTypeChipValue): boolean => {
    if (value === "ALL") return isAllActive;
    return selectedTypes.includes(value);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      role="group"
      aria-label="포트폴리오 유형 필터"
    >
      <span className={filterLabelClasses}>유형:</span>
      <div className="flex flex-wrap items-center gap-2">
        {portfolioTypeChips.map((chip) => {
          const active = isChipActive(chip.value);
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => handleChipClick(chip.value)}
              className={getChipClasses(active)}
              aria-pressed={active}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
