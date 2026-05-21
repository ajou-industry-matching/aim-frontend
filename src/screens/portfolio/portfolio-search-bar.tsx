"use client";

import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/shared/ui/icons";

export type PortfolioSearchBarProps = {
  initialKeyword?: string;
  onSubmit: (keyword: string) => void;
};

const containerClasses =
  "flex h-[50px] w-full cursor-text items-center gap-2 rounded-full bg-[var(--color-primary-700,#0056b3)] px-4 py-[10px]";

const inputClasses =
  "flex-1 bg-transparent text-[14px] font-medium leading-[1.43] tracking-[-0.35px] text-[var(--color-gray-50,#f9f9f9)] placeholder:text-[var(--color-gray-50,#f9f9f9)] outline-none";

export const PortfolioSearchBar = ({ initialKeyword = "", onSubmit }: PortfolioSearchBarProps) => {
  const [value, setValue] = useState(initialKeyword);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={containerClasses}>
        <SearchIcon size={20} aria-hidden="true" className="shrink-0 text-[#f9f9f9]" />
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="포트폴리오를 검색해보세요"
          className={inputClasses}
          aria-label="포트폴리오 검색"
        />
      </div>
    </form>
  );
};
