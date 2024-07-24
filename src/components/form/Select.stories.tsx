import { fn } from "@storybook/test";
import { Select, SelectRootProps } from "./Select";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Form/Select",
  component: Select.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placeholder: "Select the state",
    defaultValue: "",
    required: true,
    onChange: fn(),
    children: [
      <Select.Item key={1} value="SC">Santa Catarina</Select.Item>,
      <Select.Item key={2} value="SP">São Paulo</Select.Item>,
      <Select.Item key={3} value="PR">Paraná</Select.Item>,
    ],
  },
  argTypes: {
    placeholder: {
      control: {
        type: "text",
      },
    },
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
} as Meta<SelectRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Custom: Story = {
  args: {
    children: [
      <Select.Item key={1} value="1">
        <div className="flex items-center">
          <img
            alt="Photo"
            className="h-7 w-7 object-cover mr-2 rounded-full"
            src="https://picsum.photos/300/300?random=1"
          />
          Alex Smith
        </div>
      </Select.Item>,
      <Select.Item key={2} value="2">
        <div className="flex items-center">
          <img
            alt="Photo"
            className="h-7 w-7 object-cover mr-2 rounded-full"
            src="https://picsum.photos/300/300?random=2"
          />
          Taylor Brown
        </div>
      </Select.Item>,
      <Select.Item key={3} value="3" disabled>
        <div className="flex items-center">
          <img
            alt="Photo"
            className="h-7 w-7 object-cover mr-2 rounded-full"
            src="https://picsum.photos/300/300?random=3"
          />
          Sam Hallway
        </div>
      </Select.Item>,
    ],
  },
};
