import { MarkDownModule } from '@/modules/mark-down-module'
import { MarkDownFrontMatter } from '@/types/matter'
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
