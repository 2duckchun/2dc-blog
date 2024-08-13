import path from 'path'
import fs from 'fs'
import { sync } from 'glob'
import { Test } from '@/components/test'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'
import matter from 'gray-matter';

const CONTENT_PATH = path.join(process.cwd(), 'content', 'post')


const parsePost = (postPath: string) => {
  try {
    const file = fs.readFileSync(postPath, {encoding:'utf-8'})
    const {content, data} = matter(file)
    const grayMatter = data

    return {...grayMatter, content }
  } catch (error) {
    console.log(error)
  }
}


const getAllPosts = () => {
  const postPaths: string[] = sync(`${CONTENT_PATH}/**/*.md`)
  return postPaths.reduce<any[]>((acc, cur) => {
    const post = parsePost(cur)
    if (!post) return acc
    return [...acc, post]
  }, [])

}

export default async function Home() {
  const markdown = new MarkDownModule(['coding-test', 'baekjoon'])
  const data = (await markdown.getMarkdownFile('2908')) as string
  const { content, frontmatter } = await customCompileMdx({
    sourse: data
  })

  const postPath = getAllPosts()
  console.log(postPath)


  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-2 md:p-24">
      <div className="w-full">
        <Test>{content}</Test>
        {/* <div className="prose m-auto">{content}</div> */}
      </div>
    </main>
  )
}
