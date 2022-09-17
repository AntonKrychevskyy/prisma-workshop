import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A `main` function so that you can use async/await
async function main() {
  console.log('+++debug: start');
  // Task 1 - Read all users
  // const users = await prisma.user.findMany();
  // console.log('+++debug: users', users);

  // Task 2 - Create a new user
  // const newUser = await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@email.com',
  //   }
  // });
  // console.log('+++debug: new user', newUser);

  // Task 5 - Create a new post
  // const newPost = await prisma.post.create({
  //   data: {
  //     title: 'Hello World Programmatically'
  //     content: 'Lorem ipsum dolor sit amet'
  //   },
  // });
  // console.log('debug: new post' newPost);

  // Task 6.1 - Wire up the user and post
  // const updatedPost = await prisma.post.update({
  //   where: { id: 2 },
  //   data: {
  //     author: {
  //       connect: { email: 'gin.tonyk@gmail.com' },
  //     },
  //     published: true,
  //   },
  // });
  // console.log('+++debug: updated post', updatedPost);

  // Task 6.2 - Create new post with author
  // const newPost = await prisma.post.create({
  //   data: {
  //     title: 'Third Post',
  //     content: 'Lorem ipsum dolor sit amet',
  //     published: true,
  //     author: {
  //       connect: { email: 'alice@email.com' },
  //     },
  //   },
  // });
  // console.log('+++debug: new post', newPost);

  // Task 7 - Get user by unique field
  // const user = await prisma.user.findUnique({
  //   where: { email: 'gin.tonyk@gmail.com' },
  // });
  // console.log('+++debug: found user', user);

  // Task 8 - Get users with subset of fields
  // const users = await prisma.user.findMany({
  //   select: { id: true, name: true },
  // });
  // console.log('+++debug: read users', users);

  // Task 9 - Get user posts with folded data (posts)
  // const result = await prisma.user.findUnique({
  //   where: { email: 'gin.tonyk@gmail.com' },
  //   include: { posts: true },
  // });
  // const { posts: userPosts, ...user } = result ?? {};
  // console.log('+++debug: user posts', user, userPosts);

  // Task 10 - Create user with post in one transaction
  // const result = await prisma.user.create({
  //   data: {
  //     name: 'Bob Odenkirk',
  //     email: 'writesaul@justice.us',
  //     posts: {
  //       create: {
  //         title: 'Breaking Bad',
  //         content: 'Lorem ipsum dolor sit amet',
  //       },
  //     },
  //   },
  // });
  // console.log('+++debug: created user with post', result);

  // Task 11 - Get users with names starting with A
  // const aUsers = await prisma.user.findMany({
  //   where: { name: { startsWith: 'A' } },
  // });
  // console.log('+++debug: users with names starting with A', aUsers);

  // Task 12.1 - Get users with pagination (offset and limit)
  // const users = await prisma.user.findMany({
  //   skip: 2,
  //   take: 2,
  // });
  // console.log('+++debug: users with pagination', users);

  // Task 12.2 - Get users with pagination (cursor-based)
  let counter = 0;
  let cursor: any;
  let users;
  const size = await prisma.user.count();
  let i = Math.ceil(size / 2);

  const getNextPartUsers = async () => {
    counter++;
    users = await prisma.user.findMany({
      cursor: cursor && { id: cursor },
      take: 2,
      skip: cursor ? 1 : 0,
      orderBy: { id: 'asc' },
    });
    console.log(
      `+++debug: users with pagination (part ${counter})`,
      JSON.stringify(users, null, 2)
    );
    cursor = users?.slice(-1)[0]?.id;
  };

  const getAllUsers = async () => {
    while (i--) {
      await new Promise(async resolve => {
        await getNextPartUsers();
        setTimeout(resolve, 1000);
      });
    }
  };

  getAllUsers();

  // @1:15:15
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
