import { Dialog } from "./Dialog";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Text } from "./Text";

const meta = {
  title: "UI/Dialog",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content
        {...args}
      >
        <Text>Dialog content goes here. You can add more elements as needed.</Text>
      </Dialog.Content>
    </Dialog.Root>
  ),
  args: {
    title: "Dialog Title",
    description: "This is a description for the dialog.",
    size: "md"
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
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
} as Meta<typeof Dialog.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
