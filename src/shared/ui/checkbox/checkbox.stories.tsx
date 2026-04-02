<<<<<<< HEAD
import type { Meta, StoryObj } from "@storybook/nextjs";
import { useArgs } from "@storybook/preview-api";
=======
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
>>>>>>> da991be (chore: Next.js 전환 구조 정리 및 Vite 제거)
import { Checkbox, type CheckboxProps } from "./checkbox";

const meta = {
  title: "Shared/UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙션이 가능한 래퍼 컴포넌트
const InteractiveCheckbox = (args: CheckboxProps) => {
<<<<<<< HEAD
  const [{ checked }, updateArgs] = useArgs();

  return (
    <Checkbox
      {...args}
      checked={Boolean(checked)}
      onChange={(e) => updateArgs({ checked: e.target.checked })}
    />
  );
=======
  const [checked, setChecked] = useState(args.checked || false);
  return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
>>>>>>> da991be (chore: Next.js 전환 구조 정리 및 Vite 제거)
};

export const Default: Story = {
  render: (args) => <InteractiveCheckbox {...args} />,
  args: {
    label: "약관에 동의합니다",
  },
};

export const Checked: Story = {
  render: (args) => <InteractiveCheckbox {...args} />,
  args: {
    label: "선택된 상태",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성화 상태",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "비활성화 및 선택된 상태",
    disabled: true,
    checked: true,
<<<<<<< HEAD
    readOnly: true,
=======
>>>>>>> da991be (chore: Next.js 전환 구조 정리 및 Vite 제거)
  },
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <InteractiveCheckbox label="애플" />
      <InteractiveCheckbox label="바나나" />
      <InteractiveCheckbox label="오렌지" />
    </div>
  ),
  args: {},
};
