import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'
import { sync } from 'glob'
import matter from 'gray-matter'
import { MarkDownMatter } from '@/types/matter'

export class MarkDownModule {
  private directoryPath: string
  constructor(directoryPath: string | string[]) {
    if (Array.isArray(directoryPath)) {
      this.directoryPath = path.join(process.cwd(), ...directoryPath)
      return
    }
    this.directoryPath = path.join(process.cwd(), directoryPath)
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

  getFrontMatterList() {
    const postPaths: string[] = sync(`${this.directoryPath}/**/*.md`)
    return postPaths.reduce<MarkDownMatter[]>((acc, cur) => {
      const post = this.parseMarkdownFrontMatter(cur)
      if (!post) return acc
      return [...acc, post]
    }, [])
  }

  extractFileName(path: string) {
    const match = path.match(/\/([^\/]+)\.md$/)
    return match ? match[1] : null
  }
}
