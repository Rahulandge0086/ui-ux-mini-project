'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/authStore'
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: string
}

export default function Orders() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        setOrders(data.orders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchOrders()
    }
  }, [user, token, router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="text-green-600" size={20} />
      case 'shipped':
        return <FiTruck className="text-blue-600" size={20} />
      default:
        return <FiPackage className="text-orange" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700'
      case 'shipped':
        return 'bg-blue-50 text-blue-700'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700'
      default:
        return 'bg-orange-light text-orange'
    }
  }

  const orderSteps = [
    { key: 'pending', label: 'Order received' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ]

  const getStepState = (currentStatus: string, stepKey: string) => {
    const currentIndex = orderSteps.findIndex((step) => step.key === currentStatus)
    const stepIndex = orderSteps.findIndex((step) => step.key === stepKey)

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  const downloadInvoice = (order: Order) => {
    const invoiceLines = [
      `Invoice for Order ${order.id}`,
      `Date: ${new Date(order.createdAt).toLocaleString('en-IN')}`,
      `Status: ${order.status}`,
      `Total: ₹ ${order.totalAmount.toLocaleString()}`,
      '',
      'Items:',
      ...order.items.map((item) =>
        `- ${item.name} x${item.quantity} @ ₹${item.price.toLocaleString()} = ₹${(
          item.price * item.quantity
        ).toLocaleString()}`
      ),
      '',
      `Grand Total: ₹ ${order.totalAmount.toLocaleString()}`,
    ]

    const blob = new Blob([invoiceLines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${order.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return null
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-orange hover:underline mb-6"
        >
          <FiArrowLeft size={18} />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-xl text-gray-500">Loading orders...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to create your first order</p>
          <Link
            href="/shop"
            className="inline-block bg-orange text-white px-6 py-3 rounded font-semibold hover:bg-orange-dark"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                {/* Order ID */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-bold text-orange">{order.id}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Items</p>
                  <p className="font-semibold">{order.items.length} item(s)</p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="font-bold text-lg">₹ {order.totalAmount.toLocaleString()}</p>
                </div>

                {/* Status & Action */}
                <div className="flex flex-col gap-3">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => downloadInvoice(order)}
                      className="text-sm text-orange hover:underline text-center"
                    >
                      Download Invoice
                    </button>
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="text-sm text-orange hover:underline text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="mt-6 px-2">
                <p className="text-sm text-gray-600 mb-3">Order progress</p>
                <div className="space-y-4">
                  {orderSteps.map((step, index) => {
                    const state = getStepState(order.status, step.key)
                    const isLast = index === orderSteps.length - 1

                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              state === 'completed'
                                ? 'bg-green-500 border-green-500 text-white'
                                : state === 'current'
                                ? 'bg-orange text-white border-orange'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}
                          >
                            {state === 'completed' ? (
                              <FiCheckCircle size={12} />
                            ) : (
                              <span className="text-xs font-semibold">{index + 1}</span>
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className={`w-px h-10 mt-1 ${
                                state === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold capitalize">{step.label}</p>
                          <p className="text-sm text-gray-600">
                            {state === 'completed'
                              ? 'Completed'
                              : state === 'current'
                              ? 'In progress'
                              : 'Waiting for update'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Items */}
              {order.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">Items ordered:</p>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-gray-100 p-4 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm text-gray-600">Price: ₹ {item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-orange-light rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Track Your Order</h3>
            <p className="text-gray-700 text-sm">
              Click on any order to view tracking details and delivery status
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Returns & Exchanges</h3>
            <p className="text-gray-700 text-sm">
              7-day return policy on all orders. Contact support for assistance
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Customer Support</h3>
            <p className="text-gray-700 text-sm">
              Email: support@urbancart.com | Phone: +91-XXXX-XXXXXX
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
