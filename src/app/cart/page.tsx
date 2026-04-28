'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/store/cartStore'
import { FiTrash2, FiArrowLeft, FiChevronRight } from 'react-icons/fi'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 500 ? 0 : 99
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-orange text-white px-6 py-3 rounded font-semibold hover:bg-orange-dark"
          >
            Continue Shopping
            <FiChevronRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg overflow-hidden">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className={`p-3 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-gray-200 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/product/${item.id}`}
                      className="font-semibold hover:text-orange line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.color && (
                      <p className="text-sm text-gray-600 mt-1">Color: {item.color}</p>
                    )}
                    <p className="text-orange font-bold mt-2">
                      ₹ {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity & Price */}
                  <div className="text-right space-y-4">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="font-bold text-lg">
                        ₹ {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-2 text-sm"
                    >
                      <FiTrash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-orange hover:underline"
            >
              <FiArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
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
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange">₹ {Math.round(total).toLocaleString()}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-sm text-green-600 bg-green-50 p-3 rounded mb-6">
                  Add ₹{(500 - subtotal).toLocaleString()} more for FREE shipping!
                </p>
              )}

              <Link
                href="/checkout"
                className="w-full bg-orange text-white py-3 rounded font-bold hover:bg-orange-dark transition-colors block text-center mb-4"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={clearCart}
                className="w-full py-3 border-2 border-orange text-orange rounded font-semibold hover:bg-orange-light transition-colors"
              >
                Clear Cart
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>FREE delivery on orders above ₹500</span>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>Easy Returns & Exchanges within 7 days</span>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>1 Year Warranty on most products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
