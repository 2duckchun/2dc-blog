import { compileMDX } from 'next-mdx-remote/rsc'
import { options } from './options'

export const customCompileMdx = async ({ sourse }: { sourse: string }) => {
  const { content, frontmatter } = await compileMDX({
    source: sourse,
    options: options,
    components: {}
  })

  return { content, frontmatter }
}
