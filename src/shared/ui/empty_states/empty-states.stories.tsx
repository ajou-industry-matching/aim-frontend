import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-states";

const meta = {
  title: "Shared/UI/Empty States",
  component: EmptyState,
  parameters: {
    layout: "padded",
    componentSubtitle: "데이터가 없거나 에러가 발생했을 때 보여주는 화면",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "no-content",
        "no-results",
        "no-notifications",
        "error",
        "access-denied",
        "coming-soon",
      ],
      description: "사전 정의된 빈 화면 상태 타입",
    },
    title: { control: "text", description: "기본 타이틀을 덮어쓸 커스텀 타이틀" },
    description: { control: "text", description: "기본 설명을 덮어쓸 커스텀 설명" },
    hasBackground: { control: "boolean", description: "회색 배경 적용 여부" },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==========================================
// Variants Stories
// ==========================================

export const NoContent: Story = {
  args: {
    variant: "no-content",
    primaryAction: {
      label: "첫 게시물 작성하기",
      onClick: () => alert("게시물 작성 모달 오픈!"),
    },
  },
};

export const NoResults: Story = {
  args: {
    variant: "no-results",
    primaryAction: {
      label: "검색어 초기화",
      onClick: () => alert("검색어가 초기화되었습니다."),
    },
  },
};

export const NoNotifications: Story = {
  args: {
    variant: "no-notifications",
  },
};

export const ErrorState: Story = {
  args: {
    variant: "error",
    primaryAction: {
      label: "다시 시도",
      onClick: () => window.location.reload(),
    },
  },
};

export const AccessDenied: Story = {
  args: {
    variant: "access-denied",
    primaryAction: {
      label: "이전 페이지로",
      onClick: () => history.back(),
    },
    secondaryAction: {
      label: "홈으로 이동",
      onClick: () => alert("홈으로 이동합니다."),
    },
  },
};

export const ComingSoon: Story = {
  args: {
    variant: "coming-soon",
  },
};

// ==========================================
// Customizing & States
// ==========================================

export const WithBackground: Story = {
  args: {
    variant: "no-content",
    hasBackground: true,
    primaryAction: {
      label: "작성하기",
      onClick: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "`hasBackground={true}`를 전달하면 컨테이너에 연한 회색 배경(#F9F9F9)과 둥근 모서리가 적용됩니다.",
      },
    },
  },
};

export const CustomTextOverrides: Story = {
  args: {
    variant: "no-results",
    title: "원하시는 프로젝트를 찾지 못했어요 😢",
    description:
      "철자나 띄어쓰기를 확인한 후 다시 검색해 주세요.\n또는 필터를 조정해 볼 수 있습니다.",
    primaryAction: {
      label: "필터 초기화",
      onClick: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variant의 기본 아이콘을 유지하면서 `title`과 `description`만 커스텀하게 덮어쓸 수 있습니다.",
      },
    },
  },
};
