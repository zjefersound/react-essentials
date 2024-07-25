import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";
import { fn } from "@storybook/test";

const meta = {
  title: "Form/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      options: ["horizontal", "vertical"],
      control: {
        type: "radio",
      },
    },
    height: {
      table: {
        disable: true,
      },
    },
    width: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    max: 10,
    step: 1,
    onChange: fn(),
    disabled: false,
    inverted: false,
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Inverted: Story = {
  args: { inverted: true  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
};

export const Range: Story = {
  args: {
    defaultValue: [1, 5],
  },
};

export const TripleRange: Story = {
  args: {
    defaultValue: [1, 3, 5],
  },
};
