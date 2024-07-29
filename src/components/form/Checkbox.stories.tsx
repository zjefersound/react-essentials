import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { fn } from "@storybook/test";

const meta = {
  title: "Form/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    defaultChecked: true,
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Secondary: Story = {
  args: {
    color: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    color: "tertiary",
  },
};

export const Danger: Story = {
  args: {
    color: "danger",
  },
};

export const Success: Story = {
  args: {
    color: "success",
  },
};

export const Warning: Story = {
  args: {
    color: "warning",
  },
};

export const Info: Story = {
  args: {
    color: "info",
  },
};
