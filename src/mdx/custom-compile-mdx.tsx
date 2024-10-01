import { Hash } from 'lucide-react'
import Link from 'next/link'
import { compileMDX } from 'next-mdx-remote/rsc'
import { options } from './options'

export const customCompileMdx = async ({ sourse }: { sourse: string }) => {
  const { content, frontmatter } = await compileMDX({
    source: sourse,
    options: options,
    components: {
      h1: ({ children, id }) => {
        return (
          <div className="group relative">
            <Link href={`#${id}`}>
              <div className="absolute -left-3 top-[8px] hidden -translate-x-4 pr-3 text-xl group-hover:block">
                <Hash className="border-2 bg-slate-200" />
              </div>
            </Link>
            <h1>{children}</h1>
          </div>
        )
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
