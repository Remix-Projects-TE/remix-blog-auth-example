import { Outlet } from 'remix'

export default function Posts() {
  return (
    <div>
      <h1>This is the posts route</h1>
      <Outlet />
    </div>
  )
}
