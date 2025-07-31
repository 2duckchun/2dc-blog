import { compileMDX } from 'next-mdx-remote/rsc'
import { options } from './options'
import { H1HashButton } from './ui/h1-hash-button'
import { H2HashButton } from './ui/h2-hash-button'
import { H3HashButton } from './ui/h3-hash-button'

export const customCompileMdx = async ({ sourse }: { sourse: string }) => {
  const { content, frontmatter } = await compileMDX({
    source: sourse,
    options: options,
    components: {
      h1: ({ children, id }) => {
        return <H1HashButton id={id!}>{children}</H1HashButton>
      },
      h2: ({ children, id }) => {
        return <H2HashButton id={id!}>{children}</H2HashButton>
      },
      h3: ({ children, id }) => {
        return <H3HashButton id={id!}>{children}</H3HashButton>
      },
      Hint: ({ children, id }) => {
        return (
          <div className="my-5 rounded-l-md border-l-4 border-l-blue-700 bg-blue-400/20 py-1 pl-3 text-main">
            <span className="block pb-1 font-semibold text-blue-600">HINT</span>
            {children}
          </div>
        )
      },
      Description: ({ children, id, title }) => {
        return (
          <div className="my-5 rounded-l-md border-l-4 border-l-teal-700 bg-teal-400/20 px-2 py-1 text-main">
            <span className="mt-3 block px-3 text-lg font-semibold text-teal-600">
              {title}
            </span>
            {children}
          </div>
        )
      }
    }
  })

  return { content, frontmatter }
}
