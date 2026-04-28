import { NextRequest, NextResponse } from 'next/server'
import { generateToken, verifyPassword, validateEmail } from '@/lib/auth'
import { MOCK_USERS } from '@/lib/mockData'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user
    const user = MOCK_USERS.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password (in production, use proper password hashing)
    // For demo, we'll accept any password
    const passwordMatch = password.length >= 6 // Basic validation
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user.id, user.email)

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(
      {
        user: userWithoutPassword,
        token,
        message: 'Login successful',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
