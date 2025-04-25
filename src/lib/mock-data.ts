"use client"

import type { Issue } from "@/types/globelTypes"

export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "How to implement authentication with Next.js and NextAuth.js?",
    content: `<p>I'm building a Next.js application and need to implement user authentication. I've heard about NextAuth.js but I'm not sure how to set it up properly.</p>
    <p>Specifically, I need help with:</p>
    <ul>
      <li>Setting up NextAuth.js with Next.js App Router</li>
      <li>Implementing Google and GitHub OAuth providers</li>
      <li>Protecting routes based on authentication status</li>
    </ul>
    <p>Has anyone implemented this recently? Any code examples would be greatly appreciated!</p>`,
    author: {
      id: "user1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-06-15T10:30:00Z",
    tags: ["next.js", "authentication", "nextauth", "oauth"],
    votes: 15,
    solutions: [
      {
        id: "sol1",
        author: {
          id: "user2",
          name: "Sam Wilson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: `<p>I recently implemented NextAuth.js with Next.js App Router. Here's how you can do it:</p>
        <h2>1. Install the packages</h2>
        <pre><code>npm install next-auth</code></pre>
        <h2>2. Create an API route</h2>
        <p>Create a file at <code>app/api/auth/[...nextauth]/route.ts</code>:</p>
        <pre><code>import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }</code></pre>
        <h2>3. Set up environment variables</h2>
        <p>Create a <code>.env.local</code> file with your OAuth credentials.</p>
        <h2>4. Create a SessionProvider</h2>
        <p>Wrap your app with the SessionProvider in your layout.tsx file.</p>
        <p>Let me know if you need more specific help!</p>`,
        createdAt: "2023-06-15T11:45:00Z",
        votes: 8,
        reviews: [
          {
            id: "rev1",
            author: {
              id: "user3",
              name: "Taylor Swift",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 5,
            comment: "This solution worked perfectly for me! Clear and concise instructions.",
            createdAt: "2023-06-15T14:20:00Z",
          },
          {
            id: "rev2",
            author: {
              id: "user4",
              name: "Jamie Lee",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 4,
            comment: "Good solution, but I had to make some adjustments for my specific use case.",
            createdAt: "2023-06-16T09:15:00Z",
          },
        ],
        replies: [
          {
            id: "rep1",
            author: {
              id: "user1",
              name: "Alex Johnson",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content:
              "Thanks for the detailed solution! Do I need to add any additional configuration for protected routes?",
            createdAt: "2023-06-15T13:10:00Z",
            votes: 2,
            replies: [
              {
                id: "rep2",
                author: {
                  id: "user2",
                  name: "Sam Wilson",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                content:
                  "Yes, for protected routes you can create a middleware.ts file in your root directory to check the session status.",
                createdAt: "2023-06-15T14:05:00Z",
                votes: 3,
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: "sol2",
        author: {
          id: "user5",
          name: "Morgan Freeman",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: `<p>I prefer using Clerk for authentication with Next.js. It's much easier to set up and has more features out of the box.</p>
        <p>Here's how to implement it:</p>
        <ol>
          <li>Install Clerk: <code>npm install @clerk/nextjs</code></li>
          <li>Set up your environment variables</li>
          <li>Wrap your app with ClerkProvider</li>
          <li>Use the provided hooks and components</li>
        </ol>
        <p>The documentation is excellent and they have specific guides for Next.js App Router.</p>`,
        createdAt: "2023-06-16T08:30:00Z",
        votes: 5,
        reviews: [
          {
            id: "rev3",
            author: {
              id: "user6",
              name: "Emma Stone",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 3,
            comment: "This works but doesn't directly answer the question about NextAuth.js.",
            createdAt: "2023-06-16T10:45:00Z",
          },
        ],
        replies: [],
      },
    ],
  },
  {
    id: "2",
    title: "Best practices for state management in large React applications",
    content: `<p>I'm working on a large-scale React application and I'm trying to determine the best approach for state management.</p>
    <p>Currently, we're using a mix of React Context and Redux, but it's becoming unwieldy as the application grows.</p>
    <p>What are the current best practices for state management in 2023? Should we:</p>
    <ul>
      <li>Stick with Redux</li>
      <li>Move to Redux Toolkit</li>
      <li>Try Zustand or Jotai</li>
      <li>Use React Query for server state and something else for client state</li>
    </ul>
    <p>I'd appreciate insights from anyone who has worked on large React applications recently.</p>`,
    author: {
      id: "user7",
      name: "Chris Evans",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-06-10T15:20:00Z",
    tags: ["react", "state-management", "redux", "zustand"],
    votes: 22,
    solutions: [
      {
        id: "sol3",
        author: {
          id: "user8",
          name: "Scarlett Johansson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: `<p>For large React applications in 2023, I recommend the following approach:</p>
        <h3>1. Split your state concerns</h3>
        <ul>
          <li><strong>Server state</strong>: Use React Query or SWR</li>
          <li><strong>UI state</strong>: Use React's built-in useState and useReducer</li>
          <li><strong>Global state</strong>: Use Zustand</li>
        </ul>
        <p>React Query handles all the caching, background updates, and stale data for your server state, which is typically 80% of the state in most applications.</p>
        <p>Zustand is much simpler than Redux but still powerful enough for complex state. It has a smaller bundle size and a more intuitive API.</p>
        <h3>2. Consider the trade-offs</h3>
        <p>If your team is already familiar with Redux, Redux Toolkit is a good option as it reduces boilerplate. But for new projects, Zustand offers a better developer experience.</p>
        <h3>3. Use local state where possible</h3>
        <p>Don't put everything in global state. Use component state for UI-specific concerns.</p>`,
        createdAt: "2023-06-10T16:45:00Z",
        votes: 18,
        reviews: [
          {
            id: "rev4",
            author: {
              id: "user9",
              name: "Robert Downey Jr.",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 5,
            comment: "This approach has worked wonders for our team. Especially separating server and client state.",
            createdAt: "2023-06-11T09:30:00Z",
          },
          {
            id: "rev5",
            author: {
              id: "user10",
              name: "Mark Ruffalo",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 5,
            comment: "Zustand is a game-changer. So much simpler than Redux but just as powerful.",
            createdAt: "2023-06-11T14:15:00Z",
          },
        ],
        replies: [],
      },
    ],
  },
  {
    id: "3",
    title: "How to optimize performance in a Next.js application?",
    content: `<p>My Next.js application is getting slower as it grows. I'm looking for strategies to improve performance.</p>
    <p>Specifically, I'm seeing:</p>
    <ul>
      <li>Slow initial page loads</li>
      <li>Laggy client-side navigation</li>
      <li>High memory usage</li>
    </ul>
    <p>What are some effective ways to diagnose and fix performance issues in Next.js?</p>`,
    author: {
      id: "user11",
      name: "Tom Holland",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-06-05T11:10:00Z",
    tags: ["next.js", "performance", "optimization", "react"],
    votes: 19,
    solutions: [],
  },
  {
    id: "4",
    title: "Implementing real-time features with Next.js",
    content: `<p>I need to add real-time functionality to my Next.js application, such as:</p>
    <ul>
      <li>Live chat</li>
      <li>Notifications</li>
      <li>Collaborative editing</li>
    </ul>
    <p>What are the best approaches for implementing real-time features in Next.js? Should I use WebSockets, Server-Sent Events, or a third-party service?</p>
    <p>I'd appreciate any examples or libraries that have worked well for you.</p>`,
    author: {
      id: "user12",
      name: "Zendaya",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-06-02T14:25:00Z",
    tags: ["next.js", "real-time", "websockets", "sse"],
    votes: 12,
    solutions: [
      {
        id: "sol4",
        author: {
          id: "user13",
          name: "Benedict Cumberbatch",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: `<p>For real-time features in Next.js, I recommend using Socket.IO or Pusher. Here's a comparison:</p>
        <h3>Socket.IO</h3>
        <ul>
          <li><strong>Pros:</strong> Open-source, flexible, fallback mechanisms</li>
          <li><strong>Cons:</strong> Requires setting up your own server, more complex to scale</li>
        </ul>
        <h3>Pusher</h3>
        <ul>
          <li><strong>Pros:</strong> Managed service, easy to implement, scales automatically</li>
          <li><strong>Cons:</strong> Paid service with usage limits</li>
        </ul>
        <p>For a simple implementation with Socket.IO:</p>
        <pre><code>// server.js
const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(handle)
  const io = new Server(server)

  io.on('connection', (socket) => {
    console.log('a user connected')
    
    socket.on('message', (data) => {
      io.emit('message', data) // broadcast to all clients
    })
    
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})</code></pre>
        <p>For collaborative editing specifically, look into <a href="#">Yjs</a> or <a href="#">ShareDB</a>.</p>`,
        createdAt: "2023-06-02T16:40:00Z",
        votes: 9,
        reviews: [
          {
            id: "rev6",
            author: {
              id: "user14",
              name: "Elizabeth Olsen",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 5,
            comment: "I implemented Socket.IO following this approach and it works great!",
            createdAt: "2023-06-03T10:20:00Z",
          },
        ],
        replies: [],
      },
    ],
  },
  {
    id: "5",
    title: "Best practices for handling forms in React",
    content: `<p>I'm building a complex form in React with multiple steps, validation, and conditional fields. What's the best approach for managing this?</p>
    <p>I've looked into:</p>
    <ul>
      <li>Formik</li>
      <li>React Hook Form</li>
      <li>Redux Form</li>
      <li>Building a custom solution</li>
    </ul>
    <p>What are the pros and cons of each approach? Which one would you recommend for complex forms?</p>`,
    author: {
      id: "user15",
      name: "Chris Hemsworth",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-05-28T09:15:00Z",
    tags: ["react", "forms", "validation", "formik", "react-hook-form"],
    votes: 28,
    solutions: [
      {
        id: "sol5",
        author: {
          id: "user16",
          name: "Tom Hiddleston",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: `<p>For complex forms in React, I strongly recommend <strong>React Hook Form</strong>. Here's why:</p>
        <h3>React Hook Form</h3>
        <ul>
          <li><strong>Performance:</strong> Minimizes re-renders</li>
          <li><strong>Bundle size:</strong> Smaller than alternatives</li>
          <li><strong>API:</strong> Simple, hook-based API</li>
          <li><strong>Validation:</strong> Built-in validation + supports Yup, Zod, etc.</li>
          <li><strong>TypeScript:</strong> Excellent TypeScript support</li>
        </ul>
        <p>Here's a basic example:</p>
        <pre><code>import { useForm } from "react-hook-form";

function MyForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const onSubmit = data => console.log(data);
  
  // Watch a field for conditional rendering
  const showExtraField = watch("showExtra");
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName", { required: true })} />
      {errors.firstName && <span>This field is required</span>}
      
      <input {...register("lastName", { required: true })} />
      {errors.lastName && <span>This field is required</span>}
      
      <input type="checkbox" {...register("showExtra")} />
      
      {showExtraField && (
        <input {...register("extraField")} />
      )}
      
      <input type="submit" />
    </form>
  );
}</code></pre>
        <p>For multi-step forms, you can combine React Hook Form with a state machine like XState, or use a library like react-hook-form-wizard.</p>`,
        createdAt: "2023-05-28T10:30:00Z",
        votes: 22,
        reviews: [
          {
            id: "rev7",
            author: {
              id: "user17",
              name: "Chris Pratt",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 5,
            comment: "React Hook Form is amazing. We switched from Formik and saw immediate performance improvements.",
            createdAt: "2023-05-29T08:45:00Z",
          },
          {
            id: "rev8",
            author: {
              id: "user18",
              name: "Karen Gillan",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 4,
            comment: "Great solution, though I'd add that Formik has better documentation for beginners.",
            createdAt: "2023-05-29T14:20:00Z",
          },
        ],
        replies: [
          {
            id: "rep3",
            author: {
              id: "user15",
              name: "Chris Hemsworth",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content:
              "Thanks for the detailed response! How well does React Hook Form handle form arrays (e.g., dynamically adding/removing form fields)?",
            createdAt: "2023-05-28T11:15:00Z",
            votes: 3,
            replies: [
              {
                id: "rep4",
                author: {
                  id: "user16",
                  name: "Tom Hiddleston",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                content:
                  "React Hook Form handles dynamic fields very well with the useFieldArray hook. Here's a quick example:\n\n```jsx\nconst { control, register } = useForm();\nconst { fields, append, remove } = useFieldArray({ control, name: 'items' });\n\nreturn (\n  <div>\n    {fields.map((field, index) => (\n      <div key={field.id}>\n        <input {...register(`items.${index}.name`)} />\n        <button type=\"button\" onClick={() => remove(index)}>Remove</button>\n      </div>\n    ))}\n    <button type=\"button\" onClick={() => append({ name: '' })}>Add Item</button>\n  </div>\n);\n```",
                createdAt: "2023-05-28T12:05:00Z",
                votes: 5,
                replies: [],
              },
            ],
          },
        ],
      },
    ],
  },
]
