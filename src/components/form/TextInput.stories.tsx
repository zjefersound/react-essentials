import { MdPersonOutline } from "react-icons/md";
import {
  TextInput,
  TextInputRootProps,
} from "./TextInput";
import { Meta, StoryObj } from "@storybook/react";

Object.assign(MdPersonOutline, { displayName: "MdPersonOutline" });

const meta = {
  title: "Form/TextInput",
  component: TextInput.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: [
      <TextInput.Icon key={1}>
        <MdPersonOutline />
      </TextInput.Icon>,
      <TextInput.Input key={2} placeholder="Type your username" />,
    ],
  },
  argTypes: {
    color: {
      options: ["danger", "success"],
      type: "string",
      control: {
        type: "select",
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} as Meta<TextInputRootProps>;

export default meta;
type Story = StoryObj<TextInputRootProps>;

export const Default: Story = {};
export const WithError: Story = {
  args: {
    color: "danger"
  }
};
export const WithSuccess: Story = {
  args: {
    color: "success"
  }
};
export const WithoutIcon: Story = {
  args: {
    children: <TextInput.Input placeholder="Type your e-mail address" />,
  },
};
export const Currency: Story = {
  args: {
    children: <TextInput.CurrencyInput onChange={() => {}} />,
  },
};
