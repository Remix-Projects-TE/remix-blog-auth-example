import {
  LiveReload,
  Outlet,
  Link,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  json
} from 'remix'
import type { 
  LinksFunction, MetaFunction, 
  LoaderFunction, ActionFunction, 
  HeadersFunction 
} from "remix"

import styles from '~/styles/app.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: MetaFunction = () => {
  return {
    description: 'A cool blog built with remix',
    keywords: 'remix, react, javascript',
  }
}

export const loader: LoaderFunction = () => {
 return json("{"test": "demo"}");

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

const Document = function ({ children, title }) {
  return (
    <html lang="en" className="w-full h-full">
      <head>
        <meta charset="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <title>{title || 'Remix Blog Tutorial'}</title>
        <Links />
      </head>
      <body className="w-full h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

const Layout = function ({ children }) {
  return (
    <div className="flex flex-col min-h-full items-stretch">
      <header>
        <nav className="p-4 bg-gray-200 flex justify-between items-center">
          <h1 className="uppercase font-medium text-lg">
            <Link to="/" className="logo">
              Remix
            </Link>
          </h1>
          <ul className="text-sm uppercase flex gap-4">
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="p-4">{children}</div>
      </main>

      <footer className="bg-gray-200 justify-self-end">
        <div className="p-4 uppercase text-sm">
          {new Date().getFullYear()} Copyright{' '}
        </div>
      </footer>
    </div>
  )
}

export function ErrorBoundary({ error }) {
  return (
    <Document>
      <Layout>
        <div className="max-w-2xl bg-red-200 text-red-900 p-4 prose rounded">
          <h3 className="font-medium">Error:</h3>
          <p className="">{error.message}</p>
        </div>
      </Layout>
    </Document>
  )
}
