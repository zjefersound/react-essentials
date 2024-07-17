import type { Meta, StoryObj } from "@storybook/react";
import { FormControl, FormControlProps } from "./FormControl";
import { TextInput } from "./TextInput";

const meta = {
  title: "Form/FormControl",
  component: FormControl,
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
    id: "username",
    errors: [],
    children: [
      <TextInput.Root>
        <TextInput.Input value="my_username" />
      </TextInput.Root>,
    ],
    label: "Username",
  },
} satisfies Meta<FormControlProps>;

export default meta;
type Story = StoryObj<FormControlProps>;

export const Primary: Story = {
  args: {},
};
export const WithError: Story = {
  args: {
    errors: [
      {
        field: "username",
        message: "Username must contain at least 3 characters",
      },
    ],
    children: [
      <TextInput.Root color="danger">
        <TextInput.Input value="my_username" />
      </TextInput.Root>,
    ],
  },
};
