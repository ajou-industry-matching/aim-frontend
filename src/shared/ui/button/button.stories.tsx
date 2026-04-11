import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import "../../../index.css";
import { Button } from "./button";
import { PlusIcon, XIcon, ArrowRightIcon } from "@/shared/ui/icons";

// Storybook Meta 정의
const meta = {
  title: "Shared/UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
      description: "버튼의 스타일 변형",
      table: {
        type: { summary: "primary | secondary | ghost | danger" },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "버튼의 크기",
      table: {
        type: { summary: "small | medium | large" },
        defaultValue: { summary: "medium" },
      },
    },
    iconPosition: {
      control: "select",
      options: ["none", "left", "right"],
      description: "아이콘 위치",
      table: {
        type: { summary: "none | left | right" },
        defaultValue: { summary: "none" },
      },
    },
    children: {
      control: "text",
      description: "버튼 텍스트 (없으면 IconButton 모드)",
    },
    fullWidth: {
      control: "boolean",
      description: "전체 너비 사용 여부",
    },
    isLoading: {
      control: "boolean",
      description: "로딩 상태",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const WithLeftIcon: Story = {
  args: {
    variant: "primary",
    iconPosition: "left",
    icon: <PlusIcon />,
    children: "포트폴리오 추가",
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: "primary",
    iconPosition: "right",
    icon: <ArrowRightIcon />,
    children: "다음",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "ghost",
    icon: <XIcon />,
    "aria-label": "닫기",
  },
};
