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
    description: { control: "text", description: "안내 문구" },
    externalUrl: { control: "text", description: "연결할 외부 공식 페이지 URL" },
    externalLinkLabel: { control: "text", description: "외부 링크 버튼 텍스트" },
  },
} satisfies Meta<typeof PolicyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Terms: Story = {
  args: {
    title: "이용약관",
    description: "AIM AJOU의 이용약관은 아주대학교 SOFTCON 페이지에서 확인하실 수 있습니다.",
    externalUrl: "https://softcon.ajou.ac.kr/community/privacy_policy.asp",
    externalLinkLabel: "이용약관 확인하기",
  },
};

export const Privacy: Story = {
  args: {
    title: "개인정보처리방침",
    description:
      "AIM AJOU는 아주대학교의 개인정보처리방침을 따릅니다. 자세한 내용은 아주대학교 공식 페이지에서 확인하실 수 있습니다.",
    externalUrl: "https://www.ajou.ac.kr/kr/guide/policy.do",
    externalLinkLabel: "개인정보처리방침 확인하기",
  },
};

export const Sitemap: Story = {
  args: {
    title: "사이트맵",
    description: "AIM AJOU는 아주대학교 사이트맵을 함께 안내해 드립니다.",
    externalUrl: "https://www.ajou.ac.kr/kr/guide/sitemap.do",
    externalLinkLabel: "아주대학교 사이트맵 확인하기",
  },
};
