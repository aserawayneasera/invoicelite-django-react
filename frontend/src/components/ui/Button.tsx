import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: ReactNode
}

const variants = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  danger:    'bg-red-600 text-white hover:bg-red-700',
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50', variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
