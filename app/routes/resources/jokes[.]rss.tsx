import * as yup from 'yup'
import { Form, redirect, json } from 'remix'
import { useActionData } from 'remix'
import type { LoaderFunction } from "remix";
import { db } from '~/utils/db.server'
import { getUserId } from "~/utils/session.server";
import { createUserSession, login, register } from '~/utils/session.server'
import { getErrorMessage, buildValidationErrorFields } from '~/utils/misc'
import { Button } from '~/components/button'
import classNames from 'classnames'

let schema = yup.object().shape({
  loginType: yup
    .string()
    .matches(/(login|register)/, 'Selected login type is not supported.')
    .required('Choose to login or register.'),
  username: yup
    .string()
    .min(4, 'Must be at least four characters.')
    .required('Username is required.'),
  password: yup
    .string()
    .matches(/^(?=.*[A-Z])/, 'Must include an uppercase letter.')
    .matches(/^(?=.*[a-z])/, 'Must include an lowercase letter.')
    .matches(/^(?=.*\d)/, 'Must include a number.')
    .matches(/^(?=.*[@$!%*#?&])/, 'Must include a special character.')
    .min(8, 'Must be at least eight characters.')
    // .matches(/^[A-Za-z\d@$!%*#?&]{8,}$/, 'Must be eight characters long.')
    .required('Password is required.'),
})

export let loader: LoaderFunction = ({ request }) => {
let userId = await getUserId(request);
  let jokes = userId
    ? await db.joke.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { jokester: { select: { username: true } } },
        where: { jokesterId: userId },
      })
    : [];

 const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  let domain = `${protocol}://${host}`;
  const jokesUrl = `${domain}/jokes`;

let rssString = `
    <rss xmlns:blogChannel="${jokesUrl}" version="2.0">
      <channel>
        <title>Remix Jokes</title>
        <link>${jokesUrl}</link>
        <description>Some funny jokes</description>
        <language>en-us</language>
        <generator>Kody the Koala</generator>
        <ttl>40</ttl>
        ${jokes
          .map((joke) =>
            `
            <item>
              <title>${joke.name}</title>
              <description>A funny joke called ${joke.name}</description>
              <author>${joke.jokester.username}</author>
              <pubDate>${joke.createdAt}</pubDate>
              <link>${jokesUrl}/${joke.id}</link>
              <guid>${jokesUrl}/${joke.id}</guid>
            </item>
          `.trim()
          )
          .join("\n")}
      </channel>
    </rss>
  `.trim();

  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(Buffer.byteLength(rssString)),
    },
  });
};

};

function loginUser() {}

export const action = async ({ request, params }) => {
  const form = await request.formData()
  const loginType = form.get('loginType') || ''
  const username = form.get('username') || ''
  const password = form.get('password') || ''
  const values = { loginType, username, password }

  try {
    await schema.validate(values, { abortEarly: false })

    if (loginType === 'login') {
      const user = await login({ username, password })

      if (!user) {
        const message = `Invalid user credentials`
        return json({ error: { message }, user }, { status: 400 })
      }

      return createUserSession(user.id, '/posts')
    } else {
      const userExists = await db.user.findFirst({
        where: { username },
      })

      if (userExists) {
        const message = `User "${username}" already exists.`
        return json({ error: { message } }, { status: 400 })
      }

      const user = await register({ username, password })

      if (!user) {
        const message = `Something went wrong.`
        return json({ error: { message } }, { status: 400 })
      }

      return createUserSession(user.id, '/posts')
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.fields = buildValidationErrorFields(error)
    }
    console.log(error)
    return json({ error }, { status: 400 })
  }
}

function ErrorMessage({ error, className }) {
  return (
    <>
      {error && (
        <ul
          className={classNames(
            'not-prose text-sm mt-2 text-red-900',
            className
          )}
        >
          {error.map((msg, i) => (
            <li key={`error-0${i}`}>{msg}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default function Login() {
  const data = useActionData() || {}
  console.log(data)
  const { error } = data

  function getField(name, option) {
    switch (option) {
      case 'error':
        const hasError = error?.fields && error.fields[name]
        return hasError ? error.fields[name] : null
      default:
        const hasValue = error?.value && error.value[name]
        return hasValue ? error.value[name] : null
    }
  }

  return (
    <div>
      <header>
        <h1>Login Page</h1>
      </header>

      <div className="mt-6 prose">
        <Form method="POST">
          {error?.message && (
            <div className="px-4 py-3 mb-6 text-red-900 bg-red-200 rounded">
              <em>{error.message}</em>
              {error?.errors.length > 1 && (
                <ErrorMessage error={error.errors} />
              )}
            </div>
          )}
          <fieldset>
            <legend className="font-bold">Login or Register</legend>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="loginType"
                  value="login"
                  defaultChecked={
                    !getField('loginType') || getField('loginType') === 'login'
                  }
                />
                <span>Login</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="loginType"
                  value="register"
                  defaultChecked={getField('loginType') === 'register'}
                />
                <span>Register</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="loginType"
                  value="invalid"
                  defaultChecked={getField('loginType') === 'invalid'}
                />
                <span>Invalid Option</span>
              </label>
            </div>
            <ErrorMessage error={getField('loginType', 'error')} />
          </fieldset>

          <div className="mt-6">
            <label>
              <span className="font-bold">Username</span>
              <input
                type="text"
                name="username"
                defaultValue="luke"
                className="mt-1 ml-2 border-gray-400 rounded"
              />
            </label>
            <ErrorMessage error={getField('username', 'error')} />
          </div>

          <div className="mt-6">
            <label htmlFor="password" className="font-bold">
              <span className="font-bold">Password</span>
              <input
                id="password"
                type="text"
                name="password"
                defaultValue="Freedom1!"
                className="mt-1 ml-2 border-gray-400 rounded"
              />
            </label>
            <ErrorMessage error={getField('password', 'error')} />
          </div>

          <div className="mt-6">
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};







