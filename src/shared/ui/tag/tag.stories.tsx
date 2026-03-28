import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import "../../../index.css";
import { Tag } from "./tag";

const meta = {
  title: "Shared/UI/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "태그 텍스트",
    },
    onRemove: {
      description: "삭제 버튼 클릭 콜백 (없으면 X 버튼 미표시)",
    },
  },
  args: {
    onRemove: fn(),
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "React" },
};

export const TypeScript: Story = {
  args: { children: "TypeScript" },
};

export const TailwindCSS: Story = {
  args: { children: "Tailwind CSS" },
};

export const WithoutRemove: Story = {
  args: {
    children: "읽기 전용 태그",
    onRemove: undefined,
  },
};
