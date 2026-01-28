import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Textarea, Select } from "./inputBox";
import { PlusIcon, UserIcon } from "@/shared/ui/icons"; // 예시 아이콘

// 메인 메타 정보는 'Input'을 기준으로 설정
const meta = {
  title: "Shared/UI/InputBox",
  component: Input,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "하나의 모듈(inputBox)에서 제공되는 Input, Textarea, Select 컴포넌트입니다. Figma 2.0 가이드를 준수합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["medium", "large"],
      description: "Input 높이 설정 (Select는 Large 고정)",
    },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- 1. Basic Text Input ---
export const TextInput: Story = {
  args: {
    placeholder: "텍스트를 입력해주세요",
    size: "large",
  },
};

export const WithIcons: Story = {
  args: {
    placeholder: "아이콘이 있는 입력창",
    leftIcon: <PlusIcon />,
    rightIcon: <UserIcon />,
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <Input placeholder="기본 (Default)" />
      <Input placeholder="포커스 (Focus)" autoFocus />
      <Input placeholder="에러 (Error)" error defaultValue="잘못된 값" />
      <Input placeholder="비활성 (Disabled)" disabled defaultValue="입력 불가" />
    </div>
  ),
};

// --- 2. Password Input ---
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호 입력",
    size: "large",
  },
};

export const PasswordStrength: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호 설정",
    passwordStrength: 2, // 0~3 단계
  },
  parameters: {
    docs: {
      description: {
        story: "passwordStrength prop(1~3)을 전달하면 하단에 강도 표시 바가 나타납니다.",
      },
    },
  },
};

// --- 3. Search Input ---
export const Search: Story = {
  args: {
    type: "search",
    placeholder: "검색어를 입력하세요...",
    size: "medium", // 검색창은 보통 Medium 사용
  },
  parameters: {
    docs: {
      description: {
        story: "type='search' 지정 시 Pill Shape(둥근 모서리)와 회색 배경이 적용됩니다.",
      },
    },
  },
};

// --- 4. Textarea ---
// StoryObj의 타입을 Textarea로 지정하여 args 추론
export const TextareaField: StoryObj<typeof Textarea> = {
  render: (args) => <Textarea {...args} />,
  args: {
    placeholder: "내용을 입력해주세요 (최대 500자)",
    maxLength: 500,
    fullWidth: true,
  },
};

// --- 5. Select ---
export const SelectField: StoryObj<typeof Select> = {
  render: (args) => <Select {...args} />,
  args: {
    placeholder: "선택해주세요",
    options: [
      { label: "옵션 1", value: 1 },
      { label: "옵션 2", value: 2 },
      { label: "옵션 3", value: 3 },
    ],
    fullWidth: true,
  },
};
