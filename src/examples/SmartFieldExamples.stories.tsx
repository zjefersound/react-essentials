import type { Meta, StoryObj } from '@storybook/react';

import { SmartFieldExamples } from './SmartFieldExamples';

const meta = {
  title: 'Example/SmartFieldExamples',
  component: SmartFieldExamples,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SmartFieldExamples>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
