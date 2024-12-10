import { TestButton } from './test-button'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Test Button',
  component: TestButton,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof TestButton>

export default meta

type Story = StoryObj<typeof meta>

export const 정상화버튼: Story = {
  args: {
    primary: true,
    label: '정상화',
    라면: 'dongas',
    onClick: () => {
      alert('정상화')
    }
  }
}
