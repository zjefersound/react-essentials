import type { Meta, StoryObj } from '@storybook/react';

import { ToastExample } from './ToastExample';

const meta = {
  title: 'Example/ToastExample',
  component: ToastExample,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ToastExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
