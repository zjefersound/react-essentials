import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta = {
  title: "UI/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    children: "Having a generic text that was written by a human is way better than any lorem ipsum. I know this text isn't creative, but it's a text and it's doing its best.",
    size: "md"
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
