import { FunctionComponent, HTMLAttributes } from 'react'

interface FooterProps extends HTMLAttributes<HTMLDivElement> {}

export const Footer: FunctionComponent<FooterProps> = ({
  className,
  ...props
}): JSX.Element => {
  return (
    <footer className="mt-[125px] flex min-h-[100px] items-center justify-center border-t-2 text-center text-black">
      Made by 2duckchun
    </footer>
  )
}
