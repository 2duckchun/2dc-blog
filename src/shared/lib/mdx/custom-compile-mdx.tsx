import { ReactNode } from 'react'
import { compileMDX } from 'next-mdx-remote/rsc'
import { MarkDownFrontMatter } from '@/domain/markdown/schema/markdown'
import { Badge } from '@/shared/ui/badge'
import { formatDateToLocale } from '../format-date'
import { options } from './options'
import { H1HashButton } from './ui/h1-hash-button'
import { H2HashButton } from './ui/h2-hash-button'
import { H3HashButton } from './ui/h3-hash-button'

export const customCompileMdx = async ({ sourse }: { sourse: string }) => {
  const {
    content,
    frontmatter
  }: {
    content: ReactNode
    frontmatter: MarkDownFrontMatter
  } = await compileMDX({
    source: sourse,
    options: options,
    components: {
      h1: ({ children, id }) => {
        return (
          <header className="mb-12 border-b pb-3">
            <H1HashButton id={id!} className="font-bold tracking-tight">
              {children}
            </H1HashButton>
            <div className="text-right text-sm text-muted-foreground">
              {formatDateToLocale({
                date: frontmatter.created_date,
                format: 'dd/MM/yyyy'
              })}
            </div>
            {frontmatter.description && (
              <p className="text-base text-muted-foreground">
                {frontmatter.description}
              </p>
            )}
            {frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {frontmatter.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>
        )
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
