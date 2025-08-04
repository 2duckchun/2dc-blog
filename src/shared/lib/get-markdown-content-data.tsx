import { MarkDownModule } from '@/domain/markdown/modules'
import { MarkDownFrontMatter } from '@/domain/markdown/schema/markdown'
import { customCompileMdx } from './mdx/custom-compile-mdx'

export const getMarkdownContentData = async (
  tab: string,
  markdownName: string
) => {
  const markdownModule = new MarkDownModule([tab])
  const rawMarkDown = await markdownModule.getMarkdownFile(markdownName)
  const { content, frontmatter } = await customCompileMdx({
    sourse: rawMarkDown
  })
  return { content, frontmatter: frontmatter as MarkDownFrontMatter }
}
