import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const MOCK_ORDERS: any[] = []

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { items, shippingAddress, totalAmount } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    const order = {
      id: `ORD-${Date.now()}`,
      userId: (decoded as any).userId,
      items,
      shippingAddress,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
    }

    MOCK_ORDERS.push(order)

    return NextResponse.json(
      {
        order,
        message: 'Order created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const userOrders = MOCK_ORDERS.filter(
      (order) => order.userId === (decoded as any).userId
    )

    return NextResponse.json(
      {
        orders: userOrders,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
