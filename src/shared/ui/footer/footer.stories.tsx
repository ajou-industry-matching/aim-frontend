import type { Meta, StoryObj } from "@storybook/nextjs";
import { Footer } from "./footer";

const meta = {
  title: "Shared/UI/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 기본 (default props)
export const Default: Story = {};

// 2. 커스텀 링크
export const CustomLinks: Story = {
  args: {
    links: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
    ],
  },
};

// 3. 커스텀 주소 / 연락처
export const CustomInfo: Story = {
  args: {
    address: "서울특별시 강남구 테헤란로 123",
    phone: "T. 02-000-0000",
    copyright: "© 2025 AIM AJOU. All rights reserved.",
  },
};

// 4. 화이트 배경 위에서 확인
export const OnWhiteBackground: Story = {
  parameters: {
    backgrounds: { default: "white" },
  },
};
