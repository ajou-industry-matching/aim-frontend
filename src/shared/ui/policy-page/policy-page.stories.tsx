import type { Meta, StoryObj } from "@storybook/nextjs";
import { PolicyPage } from "./policy-page";

const meta = {
  title: "Shared/UI/Policy Page",
  component: PolicyPage,
  parameters: {
    layout: "fullscreen",
    componentSubtitle: "외부 공식 페이지로 연결되는 정책 안내 페이지",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "페이지 제목" },
    externalUrl: { control: "text", description: "연결할 외부 공식 페이지 URL" },
    externalLinkLabel: { control: "text", description: "외부 링크 버튼 텍스트" },
  },
} satisfies Meta<typeof PolicyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Terms: Story = {
  args: {
    title: "이용약관",
    externalUrl: "https://softcon.ajou.ac.kr/community/privacy_policy.asp",
    externalLinkLabel: "이용약관",
  },
};

export const Privacy: Story = {
  args: {
    title: "개인정보처리방침",
    externalUrl: "https://www.ajou.ac.kr/kr/guide/policy.do",
    externalLinkLabel: "개인정보처리방침",
  },
};

export const Sitemap: Story = {
  args: {
    title: "사이트맵",
    externalUrl: "https://www.ajou.ac.kr/kr/guide/sitemap.do",
    externalLinkLabel: "사이트맵",
  },
};
