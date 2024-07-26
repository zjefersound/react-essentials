import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";
import { fn } from "@storybook/test";

const meta = {
  title: "UI/Toast",
  component: (props) => (
    <div className="min-h-[200px]">
      <Toast {...props} />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    title: "Success",
    description: "That's the toast you wanna see often.",
    open: true,
    setOpen: fn(),
    color: "success",
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Error: Story = {
  args: {
    title: "Error",
    color: "danger",
    description: "That's not the toast you wanna see often.",
  },
};

export const Info: Story = {
  args: {
    color: "info",
    title: "Information",
    description: "Something informative, no worries."
  },
};

export const Warning: Story = {
  args: {
    color: "warning",
    title: "Warning",
    description: 'It\'s not an error, but you might wanna prevent something.',
  },
};
