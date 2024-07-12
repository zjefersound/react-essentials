import type { Meta, StoryObj } from "@storybook/react";
import { FieldError } from "./FieldError";

const meta = {
  title: "UI/FieldError",
  component: FieldError,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    id: "username",
    errors: [{ field: "username", message: "Username must contain at least 3 characters"}]
  },
} satisfies Meta<typeof FieldError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
  },
};

