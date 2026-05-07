import type { Meta, StoryObj } from "@storybook/nextjs";
import { Input, Textarea, Select } from ".";
// 아이콘 임포트
import { UserIcon, MailIcon, LockIcon, XCircleIcon } from "../icons/index";

const meta = {
  title: "Shared/UI/Input",
  component: Input,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "공통 입력 컴포넌트입니다. Input, Textarea, Select를 포함합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // 1. Size
    size: {
      control: "radio",
      options: ["medium", "large"],
      description: "입력창 크기 조절",
      table: { defaultValue: { summary: "large" } },
    },
    // 2. Boolean States
    hasError: {
      control: "boolean",
      description: "에러 상태 표시 (Red Border)",
    },
    isFullWidth: {
      control: "boolean",
      description: "부모 컨테이너 너비 100% 차지 여부",
      table: { defaultValue: { summary: "true" } },
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    // 3. Icons
    leftIcon: { control: false, description: "좌측 아이콘 (ReactNode)" },
    rightIcon: { control: false, description: "우측 아이콘 (ReactNode)" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 텍스트 입력
export const Default: Story = {
  args: {
    placeholder: "텍스트를 입력해주세요",
    size: "large",
    isFullWidth: true,
  },
};

// 아이콘 포함 (User, Mail 아이콘 예시)
export const WithIcons: Story = {
  args: {
    placeholder: "이메일 입력",
    leftIcon: <UserIcon width={20} />, // 아이콘 크기 지정 권장
    rightIcon: <MailIcon width={20} />,
    isFullWidth: true,
  },
};

// 비밀번호 입력 (강도 표시 포함)
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    leftIcon: <LockIcon width={20} />,
    passwordStrength: 2, // 0~3 단계
    isFullWidth: true,
  },
};

// 검색 입력 (Rounded Pill Shape)
export const Search: Story = {
  args: {
    type: "search",
    placeholder: "검색어를 입력하세요...",
    size: "medium",
    isFullWidth: true,
    // onClear가 전달되면 값이 있을 때 X 버튼이 자동으로 노출됨
    onClear: () => alert("Clear Clicked!"),
  },
};

// 에러 상태
export const ErrorState: Story = {
  args: {
    placeholder: "잘못된 입력",
    defaultValue: "유효하지 않은 값",
    hasError: true,
    isFullWidth: true,
    rightIcon: <XCircleIcon width={20} className="text-[color:var(--color-error-500,#EF4444)]" />,
  },
};

export const TextareaField: StoryObj<typeof Textarea> = {
  render: (args) => <Textarea {...args} />,
  args: {
    placeholder: "내용을 자세히 적어주세요.",
    maxLength: 200, // 글자수 카운터 표시
    isFullWidth: true,
    rows: 4,
  },
  argTypes: {
    hasError: { control: "boolean" },
  },
};

export const SelectField: StoryObj<typeof Select> = {
  render: (args) => <Select {...args} />,
  args: {
    placeholder: "옵션을 선택하세요",
    isFullWidth: true,
    options: [
      { label: "옵션 1", value: "option1" },
      { label: "옵션 2", value: "option2" },
      { label: "옵션 3", value: "option3" },
    ],
  },
};

// all states 모음
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-5 w-[360px] p-4 border rounded-xl bg-gray-50">
      <h3 className="text-sm font-bold text-gray-500 mb-2">Input States</h3>

      {/* 1. 기본 */}
      <Input placeholder="기본 (Default)" isFullWidth />

      {/* 2. 포커스 (autoFocus) */}
      <Input placeholder="포커스 (Focus)" autoFocus isFullWidth />

      {/* 3. 에러 */}
      <Input
        placeholder="에러 (Error)"
        defaultValue="유효하지 않은 값"
        hasError
        isFullWidth
        rightIcon={<XCircleIcon className="text-red-500" width={20} />}
      />

      {/* 4. 비활성 */}
      <Input placeholder="비활성 (Disabled)" defaultValue="수정 불가능한 값" disabled isFullWidth />

      {/* 5. 읽기 전용 */}
      <Input
        placeholder="읽기 전용 (Read Only)"
        defaultValue="읽기 전용 모드"
        readOnly
        isFullWidth
      />
    </div>
  ),
};
