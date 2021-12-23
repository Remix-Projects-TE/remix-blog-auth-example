import { Link } from 'remix'
import classNames from 'classnames'

export function Button({ children, className, variant, type, ...props }) {
  const Tag = type ? 'button' : Link

  const typeClass = {
    default: 'bg-black text-white',
    secondary: 'bg-blue-200 text-blue-900',
    danger: 'bg-red-200 text-red-900',
  }

  const sizeClass = {
    default: 'py-2 px-3 text-xs',
    small: 'py-1 px-2 text-xs',
    large: 'py-4 px-6 text-lg',
  }

  return (
    <Tag
      className={classNames(
        'font-bold rounded no-underline inline-block antialiased',
        variant?.type ? typeClass[variant.type] : typeClass['default'],
        variant?.size ? sizeClass[variant.size] : sizeClass['default'],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
