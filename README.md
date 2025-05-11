# Next.js Chat Application

A feature-rich chat application built with Next.js, Prisma, and Zustand.

## Features

- Account-based authentication system
- Friend request system
- Real-time chat between friends
- Responsive design for mobile and desktop
- SQLite database for data storage

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **State Management:** Zustand
- **Database:** SQLite with Prisma ORM
- **Authentication:** Custom JWT-based auth

## Getting Started

First, install the dependencies:

```bash
npm install
```

Next, set up the database:

```bash
npx prisma migrate dev
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser and create an account to start using the chat app.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
