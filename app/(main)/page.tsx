import { MarkDownModule } from '@/modules/mark-down-module'
import HomeView from '@/views/home'
import { TagsContextProvider } from '@/views/home/contexts/use-tag-context-provider'

export default async function HomePage() {
  const postModule = new MarkDownModule('post')
  const parsedTags = Array.from(postModule.getTagsWithFrontMatterList())
  return (
    <TagsContextProvider taglist={parsedTags}>
      <HomeView />
    </TagsContextProvider>
  )
}
