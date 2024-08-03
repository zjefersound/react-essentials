import type { Meta, StoryObj } from "@storybook/react";
import { FormControl, FormControlProps } from "./FormControl";
import { TextInput } from "./TextInput";
import { fn } from "@storybook/test";

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
    children: [
      <TextInput.Root key={1}>
        <TextInput.Input value="my_username" onChange={fn()}/>
      </TextInput.Root>,
    ],
    label: "Username",
  },
} satisfies Meta<FormControlProps>;

export default meta;
type Story = StoryObj<FormControlProps>;

export const Default: Story = {
  args: {},
};
export const WithError: Story = {
  args: {
    error: "Username is already in use",
    children: [
      <TextInput.Root key={1} borderColor="danger">
        <TextInput.Input value="my_username" onChange={fn()} />
      </TextInput.Root>,
    ],
  },
};
