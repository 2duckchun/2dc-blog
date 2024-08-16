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

  parseMarkdownGrayMatter(postPath: string): MarkDownMatter | undefined {
    try {
      const file = fs.readFileSync(postPath, { encoding: 'utf-8' })
      const { data: grayMatter } = matter(file)
      return { ...grayMatter } as MarkDownMatter
    } catch (error) {
      console.error(error)
    }
  }

  getGrayMatterList() {
    const postPaths: string[] = sync(`${this.directoryPath}/**/*.md`)
    return postPaths.reduce<MarkDownMatter[]>((acc, cur) => {
      const post = this.parseMarkdownGrayMatter(cur)
      if (!post) return acc
      return [...acc, post]
    }, [])
  }
}
