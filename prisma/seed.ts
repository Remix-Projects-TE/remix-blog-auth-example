const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
  const user = await prisma.user.create({
    data: {
      username: 'demo',
      // Hash for password: Freedom1!
      // @link https://bcrypt.online/
      passwordHash:
        '$2y$10$g.9fgGXQljy/Ji/9SrDEj.BL6utaNOAsuDbGDzENjeEyIuiMgr2oO',
    },
  })

  await Promise.all(
    getPosts().map((post) => {
      const data = { userId: user.id, ...post }
      return prisma.post.create({ data })
    })
  )
}

seed()

function getPosts() {
  return [
    {
      title: 'JavaScript Performance Tips',
      body: 'We will look at 10 simple tips and tricks to increase the speed of your code when writing JS',
    },
    {
      title: 'Tailwind vs. Bootstrap',
      body: 'Both Tailwind and Bootstrap are very popular CSS frameworks. In this article, we will compare them',
    },
    {
      title: 'Writing Great Unit Tests',
      body: 'We will look at 10 simple tips and tricks on writing unit tests in JavaScript',
    },
    {
      title: 'What Is New In PHP 8?',
      body: 'In this article we will look at some of the new features offered in version 8 of PHP',
    },
  ]
}
