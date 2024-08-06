import path from 'path'
import { sync } from 'glob'
import { Test } from '@/components/test'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'

const CONTENT_PATH = path.join(process.cwd(), 'content', 'post')

const getAllPosts = () => {
  const postPaths: string[] = sync(`${CONTENT_PATH}/**/*.md`)
  return postPaths.map((path) => {
    return {
      slug: path
    }
  })
}

export default async function Home() {
  const markdown = new MarkDownModule(['coding-test', 'baekjoon'])
  const data = (await markdown.getMarkdownFile('2908')) as string
  const { content, frontmatter } = await customCompileMdx({
    sourse: data
  })

  const postPath = getAllPosts()
  console.log(postPath)
  console.log(content)
  console.log(frontmatter)

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-2 md:p-24">
      <div className="w-full">
        <Test>{content}</Test>
        {/* <div className="prose m-auto">{content}</div> */}
      </div>
    </main>
  )
}
