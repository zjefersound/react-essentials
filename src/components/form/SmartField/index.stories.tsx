import type { Meta, StoryObj } from "@storybook/react";
import { SmartField } from "./";
import { fn } from "@storybook/test";

const meta = {
  title: "Form/SmartField",
  component: SmartField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof SmartField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  name: "Type \"Text\"",
  args: {
    value: "",
    onChangeValue: fn(),
    config: {
      type: "text",
      id: "name",
      label: "Name",
      placeholder: "Type your name",
      required: true,
    },
  },
};

export const Password: Story = {
  name: "Type \"password\"",
  args: {
    value: "",
    onChangeValue: fn(),
    config: {
      type: "password",
      id: "password",
      label: "Password",
      placeholder: "Type your password",
      required: true,
    },
  },
};

export const Select: Story = {
  name: "As Select",
  args: {
    value: "",
    onChangeValue: fn(),
    config: {
      type: "select",
      id: "language",
      label: "Language",
      placeholder: "Select the language",
      required: true,
      options: [
        { label: "English", value: "EN" },
        { label: "Português", value: "PT" },
      ],
    },
  },
};
