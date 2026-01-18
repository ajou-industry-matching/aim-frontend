import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import "@/app/index.css";
import { Button } from "./button";
import {
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
} from "@/shared/ui/icons";

// Storybook Meta 정의
const meta = {
  title: "Shared/UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "AIM AJOU 디자인 시스템의 Button 컴포넌트입니다. 텍스트 버튼과 아이콘 전용 버튼 모두 지원합니다.",
      },
    },
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

// ============================================
// 기본 Variants
// ============================================

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Button",
  },
};

// ============================================
// 크기 Variants
// ============================================

export const Small: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: "Small Button",
  },
};

export const Medium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Medium Button",
  },
};

export const Large: Story = {
  args: {
    variant: "primary",
    size: "large",
    children: "Large Button",
  },
};

// ============================================
// 아이콘 + 텍스트
// ============================================

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

export const DownloadButton: Story = {
  args: {
    variant: "secondary",
    size: "large",
    iconPosition: "left",
    icon: <DownloadIcon />,
    children: "다운로드",
  },
};

// ============================================
// 아이콘 전용 (IconButton 모드)
// ============================================

export const IconOnly: Story = {
  args: {
    variant: "ghost",
    icon: <XIcon />,
    "aria-label": "닫기",
  },
};

export const IconOnlyPrimary: Story = {
  args: {
    variant: "primary",
    icon: <SearchIcon />,
    "aria-label": "검색",
  },
};

export const IconOnlyDanger: Story = {
  args: {
    variant: "danger",
    icon: <TrashIcon />,
    "aria-label": "삭제",
  },
};

export const IconOnlySmall: Story = {
  args: {
    variant: "ghost",
    size: "small",
    icon: <XIcon />,
    "aria-label": "닫기",
  },
};

export const IconOnlyLarge: Story = {
  args: {
    variant: "primary",
    size: "large",
    icon: <CheckIcon />,
    "aria-label": "확인",
  },
};

// ============================================
// 상태
// ============================================

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Button",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    children: "Save",
    isLoading: true,
  },
};

export const FullWidth: Story = {
  args: {
    variant: "primary",
    children: "Full Width Button",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};

// ============================================
// 실제 사용 예시
// ============================================

export const FormButtons: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="ghost">취소</Button>
      <Button variant="primary" iconPosition="left" icon={<CheckIcon />}>
        저장
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "폼에서 사용되는 버튼 조합 예시",
      },
    },
  },
};

export const TableActions: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary" size="small" icon={<CheckIcon />} aria-label="승인" />
      <Button variant="danger" size="small" icon={<TrashIcon />} aria-label="삭제" />
      <Button variant="ghost" size="small" icon={<XIcon />} aria-label="닫기" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "테이블 행에서 사용되는 아이콘 버튼 조합 예시",
      },
    },
  },
};

export const CallToAction: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <Button variant="primary" size="large" iconPosition="left" icon={<PlusIcon />}>
        포트폴리오 추가
      </Button>
      <Button variant="secondary" size="large" iconPosition="left" icon={<DownloadIcon />}>
        파일 다운로드
      </Button>
      <Button variant="danger" size="large" iconPosition="left" icon={<TrashIcon />}>
        삭제하기
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "주요 CTA(Call To Action) 버튼 예시",
      },
    },
  },
};

// ============================================
// 모든 Variants 한눈에 보기
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Primary */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Primary</h3>
        <div className="flex gap-3 items-center">
          <Button variant="primary" size="small">
            Small
          </Button>
          <Button variant="primary" size="medium">
            Medium
          </Button>
          <Button variant="primary" size="large">
            Large
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Secondary */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Secondary</h3>
        <div className="flex gap-3 items-center">
          <Button variant="secondary" size="small">
            Small
          </Button>
          <Button variant="secondary" size="medium">
            Medium
          </Button>
          <Button variant="secondary" size="large">
            Large
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Ghost */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Ghost</h3>
        <div className="flex gap-3 items-center">
          <Button variant="ghost" size="small">
            Small
          </Button>
          <Button variant="ghost" size="medium">
            Medium
          </Button>
          <Button variant="ghost" size="large">
            Large
          </Button>
          <Button variant="ghost" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Danger */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Danger</h3>
        <div className="flex gap-3 items-center">
          <Button variant="danger" size="small">
            Small
          </Button>
          <Button variant="danger" size="medium">
            Medium
          </Button>
          <Button variant="danger" size="large">
            Large
          </Button>
          <Button variant="danger" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Icon Buttons */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Icon Buttons</h3>
        <div className="flex gap-3 items-center">
          <Button variant="ghost" size="small" icon={<XIcon />} aria-label="닫기" />
          <Button variant="ghost" size="medium" icon={<XIcon />} aria-label="닫기" />
          <Button variant="ghost" size="large" icon={<XIcon />} aria-label="닫기" />
          <Button variant="primary" icon={<SearchIcon />} aria-label="검색" />
          <Button variant="danger" icon={<TrashIcon />} aria-label="삭제" />
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h3 className="text-lg font-semibold mb-3">With Icons</h3>
        <div className="flex gap-3 items-center">
          <Button variant="primary" iconPosition="left" icon={<PlusIcon />}>
            추가
          </Button>
          <Button variant="secondary" iconPosition="left" icon={<DownloadIcon />}>
            다운로드
          </Button>
          <Button variant="primary" iconPosition="right" icon={<ArrowRightIcon />}>
            다음
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "모든 버튼 변형을 한눈에 볼 수 있는 쇼케이스",
      },
    },
  },
};
