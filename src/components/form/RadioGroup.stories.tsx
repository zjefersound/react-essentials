import { fn } from "@storybook/test";
import { RadioGroup, RadioGroupRootProps } from "./RadioGroup";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Form/RadioGroup",
  component: RadioGroup.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    defaultValue: "",
    required: true,
    disabled: false,
    onChange: fn(),
    children: [
      <RadioGroup.Item key={1} value="sm">
        Small
      </RadioGroup.Item>,
      <RadioGroup.Item key={2} value="md">
        Medium
      </RadioGroup.Item>,
      <RadioGroup.Item key={3} value="lg">
        Large
      </RadioGroup.Item>,
    ],
  },
  argTypes: {
    defaultValue: {
      control: {
        type: "text",
      },
    },
    value: {
      control: {
        type: "text",
      },
    },
    required: {
      control: { type: "boolean" },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} as Meta<RadioGroupRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    borderColor: "danger"
  }
};

export const WithSuccess: Story = {
  args: {
    borderColor: "success"
  }
};