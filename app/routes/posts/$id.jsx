import { Form, redirect, useLoaderData } from 'remix'
import { Button } from '~/components/button'
import { db } from '~/utils/db.server'

export const loader = async ({ params }) => {
  const post = await db.post.findUnique({
    where: { id: params.id },
  })

  if (!post) {
    throw new Error(`Post not found`)
  }

  return post
}

export const action = async ({ request, params }) => {
  const form = await request.formData()
  const method = form.get('_method')

  if (method !== 'delete') {
    return redirect(`/posts/${params.id}`)
  }

  const post = await db.post.findUnique({
    where: { id: params.id },
  })

  if (!post) {
    throw new Error(`Post not found`)
  }

  await db.post.delete({ where: { id: params.id } })
  return redirect('/posts')
}

export default function Post() {
  const post = useLoaderData()

  return (
    <div id={post.id} className="mt-10 prose">
      <header>
        <Button to="/posts" className="mb-4">
          Back
        </Button>
        <h1>{post.title}</h1>
      </header>

      <div>{post.body}</div>

      <footer class="mt-6">
        <Form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <Button type="submit" variant={{ type: 'danger' }}>
            Delete
          </Button>
        </Form>
      </footer>
    </div>
  )
}
