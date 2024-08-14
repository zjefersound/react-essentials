import type { Meta, StoryObj } from '@storybook/react';

import { SmartFormExample } from './SmartFormExample';

const meta = {
  title: 'Example/SmartFormExample',
  component: SmartFormExample,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SmartFormExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
