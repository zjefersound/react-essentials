import type { Meta, StoryObj } from '@storybook/react';

import { FileInputExample } from './FileInputExample';

const meta = {
  title: 'Example/FileInputExample',
  component: FileInputExample,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FileInputExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
