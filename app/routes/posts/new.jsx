import { Form, redirect } from 'remix'
import { Button } from '~/components/button'
import { db } from '~/utils/db.server'

export const action = async ({ request, params }) => {
  const form = await request.formData()

  const title = form.get('title')
  const body = form.get('body')

  const fields = { title, body }
  const post = await db.post.create({ data: fields })

  return redirect(`/posts/${post.id}`)
}

export default function NewPost() {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <h1 className="font-medium text-2xl">New Post</h1>
        <Button to="/posts">Back</Button>
      </div>

      <Form method="POST">
        <div className="mt-4">
          <label htmlFor="title" className="font-bold block">
            Title
          </label>
          <input
            className="mt-1 border-gray-400 rounded"
            type="text"
            name="title"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="body" className="font-bold block">
            Content
          </label>
          <textarea
            className="mt-1 border-gray-400 rounded"
            name="body"
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div className="mt-4">
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </div>
  )
}
