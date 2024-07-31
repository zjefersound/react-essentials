import type { Meta, StoryObj } from "@storybook/react";
import { FileInput, FileInputProps } from "./FileInput";
import { fn } from "@storybook/test";

const meta = {
  title: "Form/FileInput",
  component: FileInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    files: [],
    onFilesChange: fn(),
    onFileRemove: fn(),
    name: "input",
  },
} as Meta<FileInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
