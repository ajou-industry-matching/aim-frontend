import type { Meta, StoryObj } from "@storybook/nextjs";

import { HomePage } from "./home";

const meta = {
  title: "Pages/Home",
  component: HomePage,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};
