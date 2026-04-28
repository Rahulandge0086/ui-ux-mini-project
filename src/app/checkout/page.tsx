'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/store/cartStore'
import { useAuth } from '@/store/authStore'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'

export default function Checkout() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const { user, token } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)
  const [orderID, setOrderID] = useState('')

  // Form states
  const [shippingData, setShippingData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  })

  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paymentMethod: 'card',
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal > 500 ? 0 : 99
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  if (!user) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to checkout</h1>
        <Link
          href="/login"
          className="inline-block bg-orange text-white px-6 py-3 rounded font-semibold hover:bg-orange-dark"
        >
          Go to Login
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link
          href="/shop"
          className="inline-block bg-orange text-white px-6 py-3 rounded font-semibold hover:bg-orange-dark"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          shippingAddress: shippingData,
          totalAmount: Math.round(total),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()
      setOrderID(data.order.id)
      setOrderCreated(true)
      clearCart()
      setTimeout(() => {
        router.push(`/order-confirmation/${data.order.id}`)
      }, 2000)
    } catch (error) {
      console.error('Order creation error:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderCreated) {
    return (
      <div className="container-custom py-12">
        <div className="bg-white rounded-lg p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">Order ID: {orderID}</p>
          <p className="text-gray-600 mb-6">Redirecting to confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-orange hover:underline mb-8"
      >
        <FiArrowLeft size={18} />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Steps */}
          <div className="flex gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 py-3 rounded text-center font-semibold transition-colors ${
                  s === step
                    ? 'bg-orange text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Confirm'}
              </div>
            ))}
          </div>

          {/* Shipping Form */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="bg-white rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={shippingData.firstName}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={shippingData.lastName}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={shippingData.email}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={shippingData.phone}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  required
                  value={shippingData.address}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={shippingData.city}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, city: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">State</label>
                  <input
                    type="text"
                    required
                    value={shippingData.state}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, state: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={shippingData.zipCode}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, zipCode: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange text-white py-3 rounded font-bold hover:bg-orange-dark"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {/* Payment Form */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>

              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-4 border-2 border-orange rounded cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentData.paymentMethod === 'card'}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, paymentMethod: e.target.value })
                    }
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded cursor-pointer hover:border-orange">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentData.paymentMethod === 'upi'}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, paymentMethod: e.target.value })
                    }
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">UPI</span>
                </label>
              </div>

              {paymentData.paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={paymentData.cardName}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, cardName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      required
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, cardNumber: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/25"
                        required
                        value={paymentData.expiry}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, expiry: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        required
                        maxLength={3}
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, cvv: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-orange text-orange rounded font-bold hover:bg-orange-light"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange text-white py-3 rounded font-bold hover:bg-orange-dark disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 pb-4 border-b">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-orange font-bold">₹ {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shipping === 0 ? 'FREE' : `₹ ${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18%)</span>
                <span>₹ {Math.round(tax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span>Total</span>
                <span className="text-orange">₹ {Math.round(total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
