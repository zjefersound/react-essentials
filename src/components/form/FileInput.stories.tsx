import type { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./FileInput";
import { fn } from "@storybook/test";

const meta = {
  title: "Form/FileInput",
  component: FileInput.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    children: [
      <FileInput.Dropzone>
        <FileInput.Input name="photos" files={[]} onFilesChange={fn()} />
      </FileInput.Dropzone>,
      <FileInput.List
        files={[]}
        onFilesChange={fn()}
        onFileRemove={(file) => {
          console.log("Removed file:", file);
        }}
      />,
    ],
  },
} as Meta<typeof FileInput.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
