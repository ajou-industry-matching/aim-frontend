import type { Meta, StoryObj } from "@storybook/nextjs";
import { ImageUploadBlock } from "./image-upload-block";

const meta = {
  title: "Shared/UI/RichEditor/ImageUploadBlock",
  component: ImageUploadBlock,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "radio",
      options: ["uploading", "error"],
    },
  },
} satisfies Meta<typeof ImageUploadBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uploading: Story = {
  args: {
    status: "uploading",
  },
};

export const Failed: Story = {
  args: {
    status: "error",
    message: "이미지를 올리지 못했어요. 잠시 후 다시 시도해주세요.",
    onRemove: () => {},
  },
};
