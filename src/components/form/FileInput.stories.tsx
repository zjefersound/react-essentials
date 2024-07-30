import type { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./FileInput";

const meta = {
  title: "Form/FileInput",
  component: FileInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
  },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
  },
};

