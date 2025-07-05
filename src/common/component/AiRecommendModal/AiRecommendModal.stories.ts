import type { Meta, StoryObj } from '@storybook/react-vite';

import AiRecommendModal from './AiRecommendModal';

const meta: Meta<typeof AiRecommendModal> = {
  title: 'Common/AiRecommendModal',
  component: AiRecommendModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AiRecommendModal>;

export const Default: Story = {};
