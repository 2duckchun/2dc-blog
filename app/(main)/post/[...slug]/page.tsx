interface PageProps {}

export default async function PostPage({
  params: { slug }
}: {
  params: { slug: string[] }
}) {
  return (
    <main>
      {slug.map((el, idx) => {
        return <div key={idx}>{el}</div>
      })}
      Page
    </main>
  )
}
