import type { Meta, StoryObj } from "@storybook/react-vite";
import "../../../index.css";
import { StatusBadge } from "./status-badge";

const meta = {
  title: "Shared/UI/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["active", "inactive", "warning", "error"],
      description: "상태 값",
      table: {
        type: { summary: "active | inactive | warning | error" },
        defaultValue: { summary: "active" },
      },
    },
    label: {
      control: "text",
      description: "커스텀 라벨 (없으면 기본값 사용)",
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { status: "active" },
};

export const Inactive: Story = {
  args: { status: "inactive" },
};

export const Warning: Story = {
  args: { status: "warning" },
};

export const Error: Story = {
  args: { status: "error" },
};

export const CustomLabel: Story = {
  args: { status: "active", label: "모집 중" },
};

export const ClosedLabel: Story = {
  args: { status: "inactive", label: "마감" },
};
