import type { Meta, StoryObj } from "@storybook/nextjs";
import { Loading } from "./loading";

const meta = {
  title: "Shared/UI/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
    },
    isFullScreen: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "불러오는 중...",
    size: "medium",
  },
};

export const PortfolioSearch: Story = {
  args: {
    text: "최적의 포트폴리오를 찾는 중...",
    size: "medium",
  },
};

export const DotsOnly: Story = {
  args: {
    size: "medium",
  },
};

export const Small: Story = {
  args: {
    text: "불러오는 중...",
    size: "small",
  },
};

export const Large: Story = {
  args: {
    text: "최적의 포트폴리오를 찾는 중...",
    size: "large",
  },
};

export const FullScreen: Story = {
  args: {
    text: "페이지를 불러오는 중...",
    size: "large",
    isFullScreen: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};
