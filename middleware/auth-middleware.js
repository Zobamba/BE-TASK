import base64 from 'base-64'

const validUsername = 'd1b65fc7debc3361ea86b5f14c68d2e2'
const validPassword = '13844'

function decodeCredentials (authHeader) {
  const encodedCredentials = authHeader.trim().replace(/Basic\s+/i, '')
  const decodedCredentials = base64.decode(encodedCredentials)
  return decodedCredentials.split(':')
}

export default function authMiddleware (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="user_pages"')
    return res.status(401).json({ message: 'Authentication required.' })
  }

  const [username, password] = decodeCredentials(authHeader)

  if (username === validUsername && password === validPassword) {
    // Valid credentials, proceed to the next middleware or route handler
    req.username = username
    next()
  } else {
    // Invalid credentials
    res.status(401).json({ message: 'Invalid credentials.' })
  }
}
