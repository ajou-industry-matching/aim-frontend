"use client";

import { useState } from "react";
import { Tabs } from "@/shared/ui";
import { PortfoliosTab } from "./portfolios-tab";
import { TagsTab } from "./tags-tab";

const TAB_ITEMS = [
  { id: "portfolios", label: "포트폴리오 관리" },
  { id: "tags", label: "태그 관리" },
];

export const AdminPortfoliosPage = () => {
  const [activeTab, setActiveTab] = useState("portfolios");

  return (
    <div className="flex-1 space-y-6 bg-white p-8">
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-gray-900,#1a1a1a)]">
          포트폴리오 관리
        </h1>
        <p className="text-[14px] text-[var(--color-gray-600,#666666)]">
          포트폴리오와 태그를 관리할 수 있습니다.
        </p>
      </div>

      <Tabs items={TAB_ITEMS} value={activeTab} onChange={setActiveTab} variant="pill" />

      {activeTab === "portfolios" ? <PortfoliosTab /> : <TagsTab />}
    </div>
  );
};
