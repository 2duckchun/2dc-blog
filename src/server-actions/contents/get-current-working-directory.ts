'use server'

export const getCurrentWorkingDirectory = async (): Promise<string> => {
  try {
    const cwd = process.cwd()
    console.log('Current working directory:', cwd)
    return cwd
  } catch (error) {
    console.error('CWD 가져오기 오류:', error)
    return 'Error getting CWD'
  }
}
