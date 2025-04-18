import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { sign, verify } from 'hono/jwt'

interface Env {
  JWT_SECRET: string
  ALLOWED_EMAILS: string
  GITHUB_TOKEN: string
  GITHUB_REPO: string
  KV: KVNamespace
  EMAIL_FROM: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS middleware with specific configuration
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))

// Error handling middleware
app.use('/*', async (c, next) => {
  try {
    await next()
  } catch (err) {
    console.error('Error:', err)
    return c.json({ error: 'Internal server error', details: err.message }, 500)
  }
})

// Auth middleware
const auth = async (c, next) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1]
    if (!token) {
      return c.json({ error: 'No token provided' }, 401)
    }

    const payload = await verify(token, c.env.JWT_SECRET)
    c.set('jwtPayload', payload)
    await next()
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

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
  try {
    const { email } = await c.req.json()
    
    if (!email || typeof email !== 'string') {
      return c.json({ error: 'Invalid email format' }, 400)
    }

    if (!isEmailAllowed(email, c.env.ALLOWED_EMAILS)) {
      return c.json({ error: 'Email not allowed' }, 403)
    }

    const code = generateCode()
    await c.env.KV.put(`code:${email}`, code, { expirationTtl: 300 }) // 5 minutes expiration

    // TODO: Implement email sending using a third-party service
    console.log(`Verification code for ${email}: ${code}`)

    return c.json({ success: true, code }) // For testing, return the code directly
  } catch (error) {
    console.error('Send code error:', error)
    return c.json({ error: 'Failed to send verification code' }, 500)
  }
})

// Verify code and generate token
app.post('/auth/verify', async (c) => {
  try {
    const { email, code } = await c.req.json()
    
    if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
      return c.json({ error: 'Invalid input format' }, 400)
    }

    console.log('Verifying code:', { email, code })
    
    const storedCode = await c.env.KV.get(`code:${email}`)
    console.log('Stored code:', storedCode)
    
    if (!storedCode || storedCode !== code) {
      console.log('Invalid code')
      return c.json({ error: 'Invalid code' }, 401)
    }

    await c.env.KV.delete(`code:${email}`)

    const token = await sign(
      { email },
      c.env.JWT_SECRET
    )
    console.log('Token generated')

    // Store user session
    await c.env.KV.put(`session:${email}`, token, { expirationTtl: 604800 }) // 7 days
    console.log('Session stored')

    return c.json({ token })
  } catch (error) {
    console.error('Verification error:', error)
    return c.json({ error: 'Internal server error', details: error.message }, 500)
  }
})

// Check session
app.get('/auth/check', auth, async (c) => {
  try {
    const { email } = c.get('jwtPayload')
    const session = await c.env.KV.get(`session:${email}`)
    
    if (!session) {
      return c.json({ error: 'Session expired' }, 401)
    }

    return c.json({ valid: true, email })
  } catch (error) {
    console.error('Check session error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Logout
app.post('/auth/logout', auth, async (c) => {
  try {
    const { email } = c.get('jwtPayload')
    await c.env.KV.delete(`session:${email}`)
    return c.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get posts
app.get('/posts', async (c) => {
  try {
    console.log('Fetching posts from GitHub...')
    console.log('GitHub Repo:', c.env.GITHUB_REPO)
    console.log('GitHub Token length:', c.env.GITHUB_TOKEN.length)
    
    const response = await fetch(`https://api.github.com/repos/${c.env.GITHUB_REPO}/issues`, {
      headers: {
        'Authorization': `Bearer ${c.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'BlackBox-Blog'
      },
    })

    console.log('GitHub response status:', response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error:', errorText)
      throw new Error(`Failed to fetch posts: ${response.status} ${errorText}`)
    }

    const posts = await response.json()
    console.log('Fetched posts:', posts.length)
    return c.json(posts)
  } catch (error) {
    console.error('Get posts error:', error)
    return c.json({ 
      error: 'Failed to fetch posts', 
      details: error.message,
      stack: error.stack
    }, 500)
  }
})

// Create post
app.post('/posts', auth, async (c) => {
  try {
    const { title, content, categories, tags, excerpt } = await c.req.json()
    console.log('Creating post with data:', { 
      title, 
      contentLength: content.length,
      categories,
      tags,
      excerpt 
    })
    
    // 处理标签，确保它们是有效的 GitHub 标签名称
    const processLabel = (label: string) => {
      // 移除不允许的字符，只保留字母、数字、连字符和下划线
      return encodeURIComponent(label)
        .replace(/%/g, '-')
        .toLowerCase();
    };

    const processedCategories = categories.map(processLabel);
    const processedTags = tags.map(processLabel);
    
    const response = await fetch(`https://api.github.com/repos/${c.env.GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'BlackBox-Blog'
      },
      body: JSON.stringify({
        title,
        body: `---
categories: ${JSON.stringify(categories)}
tags: ${JSON.stringify(tags)}
excerpt: ${excerpt}
---

${content}`,
        labels: [...processedCategories, ...processedTags],
      }),
    })

    console.log('GitHub response status:', response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error:', errorText)
      throw new Error(`Failed to create post: ${response.status} ${errorText}`)
    }

    const post = await response.json()
    console.log('Created post:', post.id)
    return c.json(post)
  } catch (error) {
    console.error('Create post error:', error)
    return c.json({ 
      error: 'Failed to create post', 
      details: error.message,
      stack: error.stack
    }, 500)
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