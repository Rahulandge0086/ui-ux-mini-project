import { NextRequest, NextResponse } from 'next/server'
import { generateToken, validateEmail, validatePassword } from '@/lib/auth'
import { MOCK_USERS } from '@/lib/mockData'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = MOCK_USERS.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create new user (in production, save to database)
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email,
      password, // In production, hash this
      name,
      phone: '',
      address: '',
      role: 'user' as const,
    }

    MOCK_USERS.push(newUser)

    // Generate token
    const token = generateToken(newUser.id, newUser.email)

    // Return user data and token
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(
      {
        user: userWithoutPassword,
        token,
        message: 'Registration successful',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
