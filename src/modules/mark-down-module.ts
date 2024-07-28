import fs from 'fs/promises'
import path from 'path'

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
    const MDFiles = await fs.readFile(
      path.join(this.directoryPath, `${filename}.md`),
      'utf-8'
    )

    return MDFiles
  }
}
