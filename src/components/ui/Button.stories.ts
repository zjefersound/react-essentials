import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    color: 'secondary'
  },
};

export const Tertiary: Story = {
  args: {
    children: "Button",
    color: 'tertiary'
  },
};

export const Danger: Story = {
  args: {
    children: "Button",
    color: 'danger'
  },
}

export const Success: Story = {
  args: {
    children: "Button",
    color: 'success'
  },
};

export const Disabled: Story = {
  args: {
    children: "Button",
    disabled: true
  },
};
