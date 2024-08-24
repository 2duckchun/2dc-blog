import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'
import { sync } from 'glob'
import matter from 'gray-matter'
import { MarkDownMatter } from '@/types/matter'
import { TagsDetailPost } from '@/types/tags'

export class MarkDownModule {
  private directoryPath: string
  constructor(directoryPath: string | string[]) {
    if (Array.isArray(directoryPath)) {
      this.directoryPath = path.join(process.cwd(), 'content', ...directoryPath)
      return
    }
    this.directoryPath = path.join(process.cwd(), 'content', directoryPath)
  }

  async getMarkdownFile(filename: string) {
    const MDFiles = await fsPromise.readFile(
      path.join(this.directoryPath, `${filename}.md`),
      'utf-8'
    )

    return MDFiles
  }

  parseMarkdownFrontMatter(postPath: string): MarkDownMatter | undefined {
    try {
      const fileName = this.extractFileName(postPath)
      const file = fs.readFileSync(postPath, { encoding: 'utf-8' })
      const { data: frontMatter } = matter(file)
      return { ...frontMatter, fileName } as MarkDownMatter
    } catch (error) {
      console.error(error)
    }
  }

  newParseMarkdownFrontMatter(postPath: string): MarkDownMatter | undefined {
    try {
      const [path1, path2] = this.newExtractFileName(postPath)
      const file = fs.readFileSync(postPath, { encoding: 'utf-8' })
      const { data: frontMatter } = matter(file)
      return { ...frontMatter, fileName: [path1, path2] } as MarkDownMatter
    } catch (error) {
      console.error(error)
    }
  }

  getFrontMatterList() {
    const postPaths: string[] = sync(`${this.directoryPath}/**/*.md`)
    return postPaths.reduce<MarkDownMatter[]>((acc, cur) => {
      const post = this.parseMarkdownFrontMatter(cur)
      if (!post) return acc
      return [...acc, post]
    }, [])
  }

  newGetFrontMatterList() {
    const postPaths: string[] = sync(`${this.directoryPath}/**/*.md`)
    return postPaths.reduce<MarkDownMatter[]>((acc, cur) => {
      const post = this.newParseMarkdownFrontMatter(cur)
      if (!post) return acc
      return [...acc, post]
    }, [])
  }

  getTagsWithFrontMatterList() {
    const postPaths: string[] = sync(`${this.directoryPath}/**/*.md`)
    const tagMap = new Map<string, TagsDetailPost>()
    const reducedData = postPaths.reduce<MarkDownMatter[]>((acc, cur) => {
      const post = this.newParseMarkdownFrontMatter(cur)
      if (!post) return acc
      return [...acc, post]
    }, [])

    tagMap.set('all', {
      count: reducedData.length,
      frontMatter: [...reducedData]
    })

    reducedData.forEach((items) => {
      items.tags.forEach((tag) => {
        const existringTagData = tagMap.get(tag) || {
          count: 0,
          frontMatter: []
        }
        tagMap.set(tag, {
          count: existringTagData.count + 1,
          frontMatter: [...existringTagData.frontMatter, { ...items }]
        })
      })
    })
    return tagMap

    // 구 코드
    // if (tagMap.has(tag)) {
    //   tagMap.set(tag, {
    //     count: tagMap.get(tag).count + 1,
    //     frontMatter: [...tagMap.get(tag).frontMatter, { ...items }]
    //   })
    // } else {
    //   tagMap.set(tag, {
    //     count: 1,
    //     frontMatter: [{ ...items }]
    //   })
    // }
  }

  extractFileName(path: string) {
    const match = path.match(/\/([^\/]+)\.md$/)
    return match ? match[1] : null
  }

  newExtractFileName(path: string) {
    const regex = /\/([^/]+)\/([^/]+)\.md$/
    const match = path.match(regex)
    if (match) {
      const part1 = match[1]
      const part2 = match[2]
      return [part1, part2]
    } else {
      throw new Error('파일 찾기에 실패했습니다.')
    }
  }
}
