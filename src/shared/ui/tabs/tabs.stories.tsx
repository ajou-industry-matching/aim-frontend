import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tabs, type TabItem } from "./tabs";

// 데모용 뱃지 컴포넌트 (실제 프로젝트에 Badge 컴포넌트가 있다면 그것으로 교체하세요)
const BadgeMock = ({ count }: { count: number }): React.ReactElement => (
  <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
    {count}
  </span>
);

const meta = {
  title: "Shared/UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
    componentSubtitle: "다양한 형태(Horizontal, Vertical, Pill)를 지원하는 탭 컴포넌트",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["horizontal", "vertical", "pill"],
      description: "탭의 스타일 변형",
      table: { defaultValue: { summary: "horizontal" } },
    },
    items: {
      description: "탭 아이템 배열 ({ id, label, badge?, isDisabled? })", // 설명 업데이트
    },
    value: {
      control: "text",
      description: "현재 선택된 탭 ID",
    },
    isAnimated: {
      control: "boolean",
      description: "탭 전환 시 인디케이터 애니메이션 활성화",
      table: { defaultValue: { summary: "false" } },
    },
    onChange: { action: "changed", description: "탭 변경 핸들러" },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----------------------------------------------------------------------
// 1. 기본 목업 데이터
// ----------------------------------------------------------------------
const defaultItems: TabItem[] = [
  { id: "tab1", label: "전체" },
  { id: "tab2", label: "진행중" },
  { id: "tab3", label: "완료" },
  { id: "tab4", label: "보류" },
];

// ----------------------------------------------------------------------
// 2. 상태 관리용 Wrapper 컴포넌트 (ESLint 훅 규칙 준수)
// ----------------------------------------------------------------------
const TabsWithState = (args: React.ComponentProps<typeof Tabs>): React.ReactElement => {
  const [selected, setSelected] = useState(args.value);
  return <Tabs {...args} value={selected} onChange={setSelected} />;
};

// ----------------------------------------------------------------------
// 3. 스토리 정의
// ----------------------------------------------------------------------

// --- 기본 (수평) 탭 ---
export const Horizontal: Story = {
  render: (args) => <TabsWithState {...args} />,
  args: {
    items: defaultItems,
    variant: "horizontal",
    value: "tab1",
    onChange: () => {},
  },
};

// --- 수직 탭 ---
export const Vertical: Story = {
  render: (args) => <TabsWithState {...args} />,
  args: {
    items: defaultItems,
    variant: "vertical",
    value: "tab1",
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Vertical Tabs는 기본적으로 200px 너비를 가집니다.",
      },
    },
  },
};

// --- 필(알약) 형태 탭 ---
export const Pill: Story = {
  render: (args) => <TabsWithState {...args} />,
  args: {
    items: defaultItems,
    variant: "pill",
    value: "tab1",
    onChange: () => {},
  },
};

// --- 뱃지가 포함된 탭 ---
export const WithBadges: Story = {
  render: (args) => <TabsWithState {...args} />,
  args: {
    items: [
      { id: "mail", label: "메일", badge: <BadgeMock count={5} /> },
      { id: "alarm", label: "알림", badge: <BadgeMock count={12} /> },
      { id: "settings", label: "설정" }, // 뱃지 없음
    ],
    variant: "horizontal",
    value: "mail", // 초기 선택값
    onChange: () => {},
  },
};

// --- 애니메이션이 적용된 수평 탭 ---
export const Animated: Story = {
  render: (args) => <TabsWithState {...args} />,
  args: {
    items: defaultItems,
    variant: "horizontal",
    value: "tab1",
    isAnimated: true,
    onChange: () => {},
  },
};

// --- 비활성화된 아이템이 포함된 탭 ---
export const WithDisabledItem: Story = {
  render: (args) => <TabsWithState {...args} />,
  args: {
    items: [
      { id: "tab1", label: "사용 가능" },
      { id: "tab2", label: "사용 불가", isDisabled: true }, // 불린 컨벤션(isDisabled) 적용
      { id: "tab3", label: "관리자 전용", isDisabled: true },
    ],
    variant: "horizontal",
    value: "tab1",
    onChange: () => {},
  },
};
