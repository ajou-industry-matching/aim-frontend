import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import "../../../index.css";
import { DropdownMenu } from "./dropdown-menu";
import { SelectDropdown } from "./select-dropdown";
import { PlusIcon, SearchIcon } from "@/shared/ui/icons";

const meta = {
  title: "Shared/UI/Dropdown",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "DropdownMenu와 SelectDropdown 두 가지 드롭다운 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseItems = [
  { label: "메뉴 항목 1", value: "item1" },
  { label: "메뉴 항목 2", value: "item2" },
  { label: "메뉴 항목 3", value: "item3" },
];

// DropdownMenu - 기본
export const Default: Story = {
  args: {
    trigger: "메뉴",
    items: baseItems,
  },
};

// DropdownMenu - 좌측 아이콘 + 단축키
export const WithIconAndShortcut: Story = {
  args: {
    trigger: "옵션",
    items: [
      { label: "새로 만들기", value: "new", leftIcon: <PlusIcon size={16} />, shortcut: "⌘N" },
      { label: "검색", value: "search", leftIcon: <SearchIcon size={16} />, shortcut: "⌘K" },
      { label: "비활성 항목", value: "disabled", disabled: true },
    ],
  },
};

// DropdownMenu - Divider 포함
export const WithDivider: Story = {
  args: {
    trigger: "설정",
    items: [
      { label: "프로필", value: "profile", dividerAfter: true },
      { label: "설정", value: "settings", dividerAfter: true },
      { label: "로그아웃", value: "logout" },
    ],
  },
};

// SelectDropdown - 기본
const SelectDefaultComponent = () => {
  const [value, setValue] = useState<string>("");
  const options = [
    { label: "2024년 1학기", value: "2024-1" },
    { label: "2024년 2학기", value: "2024-2" },
    { label: "2025년 1학기", value: "2025-1" },
    { label: "2025년 2학기", value: "2025-2" },
  ];
  return (
    <SelectDropdown
      options={options}
      value={value}
      placeholder="학기 선택"
      onChange={(opt) => setValue(String(opt.value))}
    />
  );
};
export const SelectDefault: StoryObj = { render: () => <SelectDefaultComponent /> };

// SelectDropdown - 선택된 상태
const SelectWithValueComponent = () => {
  const [value, setValue] = useState<string>("2024-1");
  const options = [
    { label: "2024년 1학기", value: "2024-1" },
    { label: "2024년 2학기", value: "2024-2" },
    { label: "2025년 1학기", value: "2025-1" },
  ];
  return (
    <SelectDropdown
      options={options}
      value={value}
      onChange={(opt) => setValue(String(opt.value))}
    />
  );
};
export const SelectWithValue: StoryObj = { render: () => <SelectWithValueComponent /> };

// SelectDropdown - 비활성화
export const SelectDisabled: StoryObj = {
  render: () => (
    <SelectDropdown options={[{ label: "옵션 1", value: "1" }]} placeholder="비활성화됨" disabled />
  ),
};

// SelectDropdown - Disabled 옵션 포함
const SelectWithDisabledOptionComponent = () => {
  const [value, setValue] = useState<string>("");
  const options = [
    { label: "카테고리 A", value: "a" },
    { label: "카테고리 B (준비중)", value: "b", disabled: true },
    { label: "카테고리 C", value: "c" },
  ];
  return (
    <SelectDropdown
      options={options}
      value={value}
      placeholder="카테고리 선택"
      onChange={(opt) => setValue(String(opt.value))}
    />
  );
};
export const SelectWithDisabledOption: StoryObj = {
  render: () => <SelectWithDisabledOptionComponent />,
};
