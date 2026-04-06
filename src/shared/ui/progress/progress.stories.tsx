import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProgressBar, CircularProgress, Spinner, Skeleton } from "./progress";

// ==========================================
// Meta
// ==========================================
const meta = {
  title: "Shared/UI/Progress",
  component: ProgressBar,
  parameters: {
    layout: "padded",
    componentSubtitle: "시스템의 진행 상태나 로딩 상태를 시각적으로 보여주는 컴포넌트들",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100 },
      description: "진행률 (0~100)",
    },
    variant: {
      control: "select",
      options: ["primary", "success", "warning", "error"],
      description: "프로그레스 바의 색상 테마",
    },
    size: {
      control: "select",
      options: ["thin", "medium", "thick"],
      description: "프로그레스 바의 두께",
    },
    hasStripes: { control: "boolean", description: "빗살무늬 패턴 적용 여부" },
    isAnimated: { control: "boolean", description: "빗살무늬 애니메이션 적용 여부" },
    labelPosition: {
      control: "select",
      options: ["none", "top", "inside"],
      description: "라벨(퍼센트) 표시 위치",
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==========================================
// ProgressBar Stories
// ==========================================
export const DefaultBar: Story = {
  args: {
    value: 45,
    variant: "primary",
    size: "medium",
    hasStripes: false,
    isAnimated: false,
    labelPosition: "none",
  },
};

export const StripedAnimatedBar: Story = {
  args: {
    value: 75,
    variant: "primary",
    size: "thick",
    hasStripes: true,
    isAnimated: true,
    labelPosition: "inside",
  },
};

// ==========================================
// Circular Progress
// ==========================================
export const Circular: StoryObj<typeof CircularProgress> = {
  render: () => (
    <div className="flex items-end gap-8">
      <CircularProgress value={25} size="small" />
      <CircularProgress value={45} size="medium" />
      <CircularProgress value={75} size="large" />
    </div>
  ),
};

// ==========================================
// Spinner
// ==========================================
export const LoadingSpinner: StoryObj<typeof Spinner> = {
  render: () => (
    <div className="flex items-end gap-8">
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>
  ),
};

// ==========================================
// Skeleton Loader
// ==========================================
export const SkeletonLoader: StoryObj<typeof Skeleton> = {
  render: () => (
    <div className="flex flex-col gap-8 max-w-[400px]">
      <div>
        <h3 className="text-sm font-bold mb-4">🏗️ Card Skeleton Example</h3>
        <div className="border border-[color:var(--color-gray-200,#E5E5E5)] rounded-xl p-4 flex flex-col gap-4 w-full">
          {/* Image placeholder */}
          <Skeleton shape="rectangle" />

          <div className="flex flex-col gap-2 mt-2">
            {/* Title */}
            <Skeleton shape="title" />
            {/* Lines */}
            <Skeleton shape="text" className="w-[90%]" />
            <Skeleton shape="text" className="w-[70%]" />
          </div>

          {/* Avatar + Meta */}
          <div className="flex items-center gap-3 mt-4">
            <Skeleton shape="circle" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton shape="text" className="w-[40%]" />
              <Skeleton shape="text" className="w-[30%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
