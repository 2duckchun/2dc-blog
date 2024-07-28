import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'

export const options = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: [remarkToc, remarkGfm],
    rehypePlugins: [
      rehypePrism as any,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor']
          }
        }
      ]
    ]
  }
}
