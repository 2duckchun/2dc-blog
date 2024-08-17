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
      }
    }
  })

  return { content, frontmatter }
}
