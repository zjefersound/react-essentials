import type { Meta, StoryObj } from "@storybook/react";
import { FormControl } from "./FormControl";

const meta = {
  title: "Form/FormControl",
  component: FormControl,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    id: "username",
    errors: [{ field: "username", message: "Username must contain at least 3 characters"}],
    children: <input className="border block rounded-md p-2"/>,
    label: "Username"
  },
} satisfies Meta<typeof FormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
  },
};

