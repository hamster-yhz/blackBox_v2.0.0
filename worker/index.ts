import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { kv } from '@vercel/kv'

interface Env {
  JWT_SECRET: string
  ALLOWED_EMAILS: string
  GITHUB_TOKEN: string
  GITHUB_REPO: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('/*', cors())

// Auth middleware
const auth = jwt({
  secret: (c) => c.env.JWT_SECRET,
})

// Helper function to check if email is allowed
const isEmailAllowed = (email: string, allowedEmails: string) => {
  const allowed = allowedEmails.split(',').map(e => e.trim())
  return allowed.includes(email)
}

// Generate verification code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send verification code
app.post('/auth/send-code', async (c) => {
  const { email } = await c.req.json()
  
  if (!isEmailAllowed(email, c.env.ALLOWED_EMAILS)) {
    return c.json({ error: 'Email not allowed' }, 403)
  }

  const code = generateCode()
  await kv.set(`code:${email}`, code, { ex: 300 }) // 5 minutes expiration

  // TODO: Implement email sending
  console.log(`Verification code for ${email}: ${code}`)

  return c.json({ success: true })
})

// Verify code and generate token
app.post('/auth/verify', async (c) => {
  const { email, code } = await c.req.json()
  
  const storedCode = await kv.get(`code:${email}`)
  if (!storedCode || storedCode !== code) {
    return c.json({ error: 'Invalid code' }, 401)
  }

  await kv.del(`code:${email}`)

  const token = await jwt.sign(
    { email },
    c.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  return c.json({ token })
})

// Get posts
app.get('/posts', async (c) => {
  try {
    const response = await fetch(`https://api.github.com/repos/${c.env.GITHUB_REPO}/issues`, {
      headers: {
        'Authorization': `token ${c.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const posts = await response.json()
    return c.json(posts)
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// Create post
app.post('/posts', auth, async (c) => {
  const { title, content, categories, tags, excerpt } = await c.req.json()
  
  try {
    const response = await fetch(`https://api.github.com/repos/${c.env.GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${c.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body: content,
        labels: [...categories, ...tags],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create post')
    }

    const post = await response.json()
    return c.json(post)
  } catch (error) {
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

// Update post
app.put('/posts/:id', auth, async (c) => {
  const id = c.req.param('id')
  const { title, content, categories, tags, excerpt } = await c.req.json()
  
  try {
    const response = await fetch(`https://api.github.com/repos/${c.env.GITHUB_REPO}/issues/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${c.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body: content,
        labels: [...categories, ...tags],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update post')
    }

    const post = await response.json()
    return c.json(post)
  } catch (error) {
    return c.json({ error: 'Failed to update post' }, 500)
  }
})

// Delete post
app.delete('/posts/:id', auth, async (c) => {
  const id = c.req.param('id')
  
  try {
    const response = await fetch(`https://api.github.com/repos/${c.env.GITHUB_REPO}/issues/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${c.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        state: 'closed',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to delete post')
    }

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to delete post' }, 500)
  }
})

export default app 