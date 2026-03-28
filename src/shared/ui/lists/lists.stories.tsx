import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListItem, Table, type TableColumn, type TableRowData } from "./lists";

const meta = {
  title: "Shared/UI/Lists & Tables",
  // Storybook Meta는 하나의 메인 컴포넌트를 필요로 하지만, 두 개를 문서화하기 위해 Wrapper 활용
  parameters: {
    layout: "padded",
    componentSubtitle: "디자인 시스템에 정의된 List Item 및 Table 컴포넌트",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

// ==========================================
// 1. List Item Stories
// ==========================================
export const ListItemDefault: StoryObj<typeof ListItem> = {
  render: (args) => <ListItem {...args} />,
  args: {
    id: "item-1",
    title: "아주대학교 산업협력 프로젝트 A",
    description: "프론트엔드 파트 UI 시스템 구축 및 공통 컴포넌트 개발 진행 중",
    metaPrimary: "진행중",
    metaSecondary: "2023.10.25",
    hasArrow: true,
  },
};

export const ListItemWithImage: StoryObj<typeof ListItem> = {
  render: (args) => <ListItem {...args} />,
  args: {
    id: "item-2",
    title: "프로필 정보 업데이트",
    description: "새로운 이미지와 프로필 상세 정보를 업데이트 하세요.",
    imageUrl: "https://picsum.photos/100/100", // 더미 이미지
    hasArrow: true,
  },
};

// 인터랙션을 확인하기 위한 상태 Wrapper (리스트)
const InteractiveList = (): React.ReactElement => {
  const [items, setItems] = useState([
    {
      id: "1",
      title: "첫 번째 항목",
      description: "설명 텍스트입니다.",
      isChecked: false,
      isActive: false,
    },
    {
      id: "2",
      title: "두 번째 항목 (Active)",
      description: "선택된 상태입니다.",
      isChecked: true,
      isActive: true,
    },
    {
      id: "3",
      title: "비활성화 항목",
      description: "클릭할 수 없습니다.",
      isChecked: false,
      isActive: false,
      isDisabled: true,
    },
  ]);

  const toggleCheck = (id: string, isChecked: boolean) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isChecked } : item)));
  };

  const selectItem = (id: string) => {
    setItems((prev) => prev.map((item) => ({ ...item, isActive: item.id === id })));
  };

  return (
    <div className="flex flex-col border border-[color:var(--color-gray-200,#E5E5E5)] rounded-lg overflow-hidden">
      {items.map((item) => (
        <ListItem
          key={item.id}
          {...item}
          hasCheckbox
          hasArrow
          onCheck={toggleCheck}
          onClick={selectItem}
        />
      ))}
    </div>
  );
};

export const ListStates: StoryObj = {
  render: () => <InteractiveList />,
};

// ==========================================
// 2. Table Stories
// ==========================================

const tableColumns: TableColumn[] = [
  { id: "status", label: "상태", width: "sm", align: "center" },
  { id: "title", label: "프로젝트 명", width: "fill" },
  { id: "manager", label: "담당자", width: "md", align: "center" },
  { id: "date", label: "등록일", width: "md", align: "right" },
];

const initialTableData: TableRowData[] = [
  {
    id: "row-1",
    status: "진행중",
    title: "웹 접근성 개선 프로젝트",
    manager: "김아주",
    date: "2023.10.24",
    isSelected: false,
  },
  {
    id: "row-2",
    status: "완료",
    title: "어드민 대시보드 리팩토링",
    manager: "이산업",
    date: "2023.10.20",
    isSelected: false,
  },
  {
    id: "row-3",
    status: "보류",
    title: "레거시 코드 제거 (비활성화)",
    manager: "박프론트",
    date: "2023.10.15",
    isDisabled: true,
  },
];

export const TableDefault: StoryObj<typeof Table> = {
  render: (args) => <Table {...args} />,
  args: {
    columns: tableColumns,
    data: initialTableData,
  },
};

export const TableEmptyState: StoryObj<typeof Table> = {
  render: (args) => <Table {...args} />,
  args: {
    columns: tableColumns,
    data: [],
    isEmpty: true,
  },
};

// 인터랙션을 확인하기 위한 상태 Wrapper (테이블)
const InteractiveTable = (): React.ReactElement => {
  const [data, setData] = useState<TableRowData[]>(initialTableData);

  const selectableRows = data.filter((r) => !r.isDisabled);
  const isAllChecked =
    selectableRows.length > 0 && selectableRows.every((r) => r.isSelected);

  const handleRowCheck = (id: string, isChecked: boolean) => {
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, isSelected: isChecked } : row)));
  };

  const handleCheckAll = (isChecked: boolean) => {
    setData((prev) =>
      prev.map((row) => (row.isDisabled ? row : { ...row, isSelected: isChecked })),
    );
  };

  const handleRowClick = (id: string) => {
    // 클릭 시 단일 선택되는 로직 예제
    setData((prev) => prev.map((row) => ({ ...row, isSelected: row.id === id })));
  };

  return (
    <Table
      columns={tableColumns}
      data={data}
      hasCheckbox
      isAllChecked={isAllChecked}
      onRowCheck={handleRowCheck}
      onCheckAll={handleCheckAll}
      onRowClick={handleRowClick}
    />
  );
};

export const TableStates: StoryObj = {
  render: () => <InteractiveTable />,
};
