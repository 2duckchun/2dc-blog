import { cn } from '@/lib/utils'

export interface TestButton {
  primary?: boolean
  size?: 'small' | 'medium' | 'large'
  라면: 'ramen' | 'dongas'
  label: string
  onClick?: () => void
}

export const TestButton = ({
  primary,
  라면 = 'dongas',
  size = 'medium',
  label,
  ...props
}: TestButton) => {
  return (
    <button
      className={cn(primary ? 'bg-primary' : 'bg-secondary', size)}
      {...props}
    >
      {label}
    </button>
  )
}
