import type { Meta, StoryObj } from "@storybook/react";
import { SmartForm } from ".";
import { fn } from "@storybook/test";

const meta = {
  title: "Form/SmartForm",
  component: SmartForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    loading: false,
    fields: [
      {
        label: "Email",
        type: "email",
        id: "email",
        required: true,
        placeholder: "Enter your email",
        validations: [
          {
            rule: (value) => /\S+@\S+\.\S+/.test(value),
            message: "Email is invalid",
          },
        ],
      },
      {
        label: "Password",
        type: "password",
        id: "password",
        required: true,
        placeholder: "Enter your password",
        validations: [
          {
            rule: (value) => value.length >= 6,
            message: "Password must be at least 6 characters",
          },
        ],
      },
    ],
    onSubmit: fn(() => new Promise((resolve) => setTimeout(resolve, 300))),
    submitText: "Log in",
  },
} satisfies Meta<typeof SmartForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithOptions: Story = {
  args: {
    fields: [
      {
        id: "state",
        label: "State",
        placeholder: "Select a state",
        required: true,
        type: "select",
        fetchOptionsFromApi: true,
      },
      {
        id: "city",
        label: "City",
        placeholder: "Select a city",
        required: true,
        type: "select",
        fetchOptionsFromApi: true,
      },
    ],
    submitText: "Save address",
    formOptions: {
      state: [
        { value: "SP", label: "São Paulo" },
        { value: "SC", label: "Santa Catarina" },
        { value: "RJ", label: "Rio de Janeiro" },
      ],
    },
  },
};
