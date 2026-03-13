import type { Meta, StoryObj } from "@storybook/react-vite";
import "../../../index.css";
import { Badge } from "./badge";
import { CheckIcon, PlusIcon } from "@/shared/ui/icons";

const meta = {
  title: "Shared/UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "error", "info", "outlined"],
      description: "배지의 스타일 변형",
      table: {
        type: { summary: "primary | secondary | success | warning | error | info | outlined" },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "배지의 크기",
      table: {
        type: { summary: "small | medium | large" },
        defaultValue: { summary: "medium" },
      },
    },
    children: {
      control: "text",
      description: "배지 텍스트",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Success: Story = {
  args: { variant: "success", children: "Success" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Warning" },
};

export const ErrorVariant: Story = {
  args: { variant: "error", children: "Error" },
};

export const Info: Story = {
  args: { variant: "info", children: "Info" },
};

export const Outlined: Story = {
  args: { variant: "outlined", children: "Outlined" },
};

export const Small: Story = {
  args: { size: "small", children: "Small" },
};

export const Large: Story = {
  args: { size: "large", children: "Large" },
};

export const WithCheckIcon: Story = {
  args: { variant: "success", icon: <CheckIcon />, children: "승인됨" },
};

export const WithPlusIcon: Story = {
  args: { variant: "primary", icon: <PlusIcon />, children: "새로운" },
};
