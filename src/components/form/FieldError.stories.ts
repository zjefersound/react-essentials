import type { Meta, StoryObj } from "@storybook/react";
import { FieldError } from "./FieldError";

const meta = {
  title: "Form/FieldError",
  component: FieldError,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    message: "Username must contain at least 3 characters",
  },
} satisfies Meta<typeof FieldError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
