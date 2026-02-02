import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import "../../../index.css";
import { Card } from "./card";
import storyDefaultImage from "@/shared/assets/images/test_img.jpg";

const meta = {
  title: "Shared/UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["post", "profile", "simple", "featured"],
      description: "카드의 스타일 변형",
      table: {
        type: { summary: "post | profile | simple | featured" },
        defaultValue: { summary: "post" },
      },
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PostCard: Story = {
  args: {
    variant: "post",
    thumbnail: storyDefaultImage,
    category: {
      label: "기술",
      color: "#4F46E5",
    },
    title: "React Server Components 이해하기",
    description:
      "새로운 React Server Components에 대한 깊이 있는 탐구와 애플리케이션 성능 향상 방법을 알아봅니다.",
    author: {
      name: "김이박",
      avatar: storyDefaultImage,
    },
    date: "2024-01-15",
    stats: {
      likes: 142,
      comments: 28,
      views: 1205,
    },
  },
};

export const ProfileCard: Story = {
  args: {
    variant: "profile",
    avatar: storyDefaultImage,
    name: "김철수",
    role: "프론트엔드 개발자",
    stats: {
      posts: 42,
      likes: 1250,
      followers: 328,
    },
    onAction: () => console.log("Follow clicked"),
    actionLabel: "팔로우",
  },
};

export const SimpleCard: Story = {
  args: {
    variant: "simple",
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">심플 카드</h3>
        <p className="text-sm text-gray-600">
          사용자 정의 콘텐츠를 담을 수 있는 심플한 카드입니다.
        </p>
      </div>
    ),
  },
};

export const FeaturedCard: Story = {
  args: {
    variant: "featured",
    image: storyDefaultImage,
    badge: "NEW",
    title: "프리미엄 기능 출시",
    description:
      "생산성을 향상시키고 워크플로우를 간소화하도록 설계된 최신 프리미엄 기능을 만나보세요.",
    ctaLabel: "자세히 보기",
    onCtaClick: () => console.log("CTA clicked"),
  },
};
