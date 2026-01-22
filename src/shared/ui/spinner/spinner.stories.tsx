import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";

const meta = {
  title: "Shared/UI/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    size: "large",
  },
};

export const CustomColor: Story = {
  render: () => (
    <div className="text-blue-500">
      <Spinner size="large" />
    </div>
  ),
};
