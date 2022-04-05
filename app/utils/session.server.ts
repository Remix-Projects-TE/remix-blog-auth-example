import bcrypt from 'bcrypt'
import { db } from './db.server'
import { createCookieSessionStorage, redirect } from 'remix'

type LoginForm = {
  email: string;
  password: string;
};

// Login User
export async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;
  return user;
}

// Register new user
export async function register({ email, password }: LoginForm) {
  let passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: { email, passwordHash },
  });
}

// Logout user and destroy session
export async function logout(request: Request) {
  let session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

// Get session secret
const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('No session secret')
}

// Create session storage
let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

// Create user session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await getSession();
  session.set('userId', userId)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

// Get user session
export function getUserSession(request: Request) {
  return getSession(request.headers.get('Cookie'))
}

// Get logged in user
export async function getUser(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (!userId || typeof userId !== 'string') {
    return null
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } })
    return user
  } catch (error) {
    return null
  }
}





export async function getUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") throw redirect("/login");
  return redirect(`/users/${userId}`);
}

export async function getUser(request: Request) {
  let userId = await getUserId(request);
  if (typeof userId !== "string") return null;

  try {
    let user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
