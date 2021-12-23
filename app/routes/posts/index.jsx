import { Link, useLoaderData } from 'remix'
import { Button } from '~/components/button'
import { db } from '~/utils/db.server'

export const loader = async ({ params }) => {
  // const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  // const posts = await response.json()

  const posts = await db.post.findMany({
    take: 20,
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return { posts }
}

export default function PostsIndex() {
  const { posts } = useLoaderData()

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <h1 className="font-medium text-2xl">Posts</h1>
        <Button to="/posts/new">New Post</Button>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <Link
                to={`/posts/${post.id}`}
                className="block p-4 border rounded hover:border-gray-500"
              >
                <h1 className="font-bold first-letter:uppercase">
                  {post.title}
                </h1>
                <p className="first-letter:uppercase mt-2">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
