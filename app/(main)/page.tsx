import path from 'path'
import fs from 'fs'
import { sync } from 'glob'
import { Test } from '@/components/test'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'
import matter from 'gray-matter';
import { MarkDownMatter } from '@/types/matter'

const CONTENT_PATH = path.join(process.cwd(), 'content', 'post')


const parsePost = (postPath: string): MarkDownMatter | undefined => {
  try {
    const file = fs.readFileSync(postPath, {encoding:'utf-8'})
    const {data} = matter(file)
    const grayMatter = data as MarkDownMatter

    return {...grayMatter }
  } catch (error) {
    console.log(error)
  }
}


const getAllPosts = () => {
  const postPaths: string[] = sync(`${CONTENT_PATH}/**/*.md`)
  return postPaths.reduce<MarkDownMatter[]>((acc, cur) => {
    const post = parsePost(cur)
    if (!post) return acc
    return [...acc, post]
  }, [])

}

export default async function Home() {
  const markdown = new MarkDownModule(['coding-test', 'baekjoon'])
  // const data = (await markdown.getMarkdownFile('2908')) as string
  // const { content, frontmatter } = await customCompileMdx({
  //   sourse: data
  // })

  const postPath = getAllPosts()
  console.log(postPath)


  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-2 md:p-24">
      <div className="w-full">
      {postPath.map((item, index) => {
        return (
          <div key={index}>
            <p>{item.title}</p>
            <p>{item.description}</p>
            <p>{String(item.created_date)}</p>
            <p>{item.thumbnail}</p>
            <p>{item.tags}</p>
            <p>{item.draft}</p>
          </div>
        )
      })}
        {/* <Test>{content}</Test> */}
        {/* <div className="prose m-auto">{content}</div> */}
      </div>
    </main>
  )
}
