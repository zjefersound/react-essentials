import type { Meta, StoryObj } from "@storybook/react";
import { CurrencyInput, CurrencyInputProps } from "./CurrencyInput";

const meta = {
  title: "Form/CurrencyInput",
  component: CurrencyInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    currency: {
      options: ["USD", "CAD", "BRL", "GBP", "YEN"],
      control: {
        type: "select",
      },
    },
    locale: {
      options: ["pt-BR", "en-US", "es-AR", "fr-FR"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    locale: "pt-BR",
    currency: "BRL",
    defaultValue: 0,
    onChange: () => {},
  },
} satisfies Meta<CurrencyInputProps>;

export default meta;
type Story = StoryObj<CurrencyInputProps>;

export const Primary: Story = {
  args: {},
};
