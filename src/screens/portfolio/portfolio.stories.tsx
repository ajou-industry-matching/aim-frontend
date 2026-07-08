import type { Meta, StoryObj } from "@storybook/nextjs";

import { PortfolioPage } from "./portfolio";

const meta = {
  title: "Pages/Portfolio",
  component: PortfolioPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PortfolioPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
