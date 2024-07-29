import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'

export default async function Home() {
  const markdown = new MarkDownModule(['coding-test', 'baekjoon'])
  const data = (await markdown.getMarkdownFile('2908')) as string
  const { content, frontmatter } = await customCompileMdx({
    sourse: data
  })

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-2 md:p-24">
      <div className="w-full">
        <div className="prose m-auto">{content}</div>
      </div>
    </main>
  )
}
