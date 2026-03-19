import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination, type PaginationProps } from "./pagination";

const meta = {
  title: "Shared/UI/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: { control: "number" },
    totalPages: { control: "number" },
    onPageChange: { action: "onPageChange" },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙션이 가능한 래퍼 컴포넌트
const InteractivePagination = (args: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
  return (
    <Pagination {...args} currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />
  );
};

export const Default: Story = {
  render: (args) => <InteractivePagination {...(args as PaginationProps)} />,
  args: {
    currentPage: 1,
    totalPages: 20,
    onPageChange: () => {},
  },
};

export const MiddlePage: Story = {
  render: (args) => <InteractivePagination {...(args as PaginationProps)} />,
  args: {
    currentPage: 10,
    totalPages: 20,
    onPageChange: () => {},
  },
};

export const EndPage: Story = {
  render: (args) => <InteractivePagination {...(args as PaginationProps)} />,
  args: {
    currentPage: 20,
    totalPages: 20,
    onPageChange: () => {},
  },
};

export const ShortRange: Story = {
  render: (args) => <InteractivePagination {...(args as PaginationProps)} />,
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
};
