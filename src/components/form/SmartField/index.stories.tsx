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
  name: "As Textinput",
  args: {
    errors: [],
    value: "",
    onChangeValue: fn(),
    field: {
      type: "text",
      id: "name",
      label: "Name",
      placeholder: "Type your name",
      required: true,
    },
  },
};

export const Select: Story = {
  name: "As Select",
  args: {
    errors: [],
    value: "",
    onChangeValue: fn(),
    field: {
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
