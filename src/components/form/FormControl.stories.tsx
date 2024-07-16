import type { Meta, StoryObj } from "@storybook/react";
import { FormControl, FormControlProps } from "./FormControl";
import { TextInput } from "./TextInput";

const meta = {
  title: "Form/FormControl",
  component: (props) => (
    <FormControl {...props}>
      <TextInput.Root type={props.errors.find(error => error.field === props.id) ? "danger" : undefined}>
        <TextInput.Input value="my_username" />
      </TextInput.Root>
    </FormControl>
  ),
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
  },
};
