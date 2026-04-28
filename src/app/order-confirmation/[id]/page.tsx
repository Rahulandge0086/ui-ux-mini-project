'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiCheck, FiTruck, FiDownload } from 'react-icons/fi'

interface Order {
  id: string
  items: any[]
  shippingAddress: any
  totalAmount: number
  status: string
  createdAt: string
}

export default function OrderConfirmation() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)

  const downloadInvoice = (order: Order) => {
    const lines = [
      `Invoice for Order ${order.id}`,
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      `Status: ${order.status}`,
      `Total Amount: ₹ ${order.totalAmount.toLocaleString()}`,
      '',
      'Shipping Address:',
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      order.shippingAddress.address,
      `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
      '',
      'Items:',
      ...(order.items.length
        ? order.items.map((item) =>
            `- ${item.name} x${item.quantity} @ ₹${item.price?.toLocaleString() || '0'} = ₹${(
              (item.price || 0) * item.quantity
            ).toLocaleString()}`
          )
        : ['No items listed in invoice']),
      '',
      `Grand Total: ₹ ${order.totalAmount.toLocaleString()}`,
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${order.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    // In a real app, you'd fetch the order from the API
    // For now, we'll create a mock order object
    const mockOrder: Order = {
      id: params.id as string,
      items: [],
      shippingAddress: {
        firstName: 'aryan',
        lastName: 'patil',
        address: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
      },
      totalAmount: 0,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    setOrder(mockOrder)
  }, [params.id])

  if (!order) {
    return (
      <div className="container-custom py-12 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg p-12 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg mb-4">Thank you for your purchase</p>
          <p className="text-2xl font-bold text-orange mb-8">Order ID: {order.id}</p>

          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div>
              <p className="text-gray-600 text-sm mb-1">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Amount</p>
              <p className="font-semibold text-orange">₹ 90,999</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Status</p>
              <p className="font-semibold text-green-600 capitalize">{order.status}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => order && downloadInvoice(order)}
            className="inline-flex items-center gap-2 bg-orange text-white px-8 py-3 rounded font-bold hover:bg-orange-dark"
          >
            <FiDownload size={20} />
            Download Invoice
          </button>
        </div>

        {/* Delivery Tracking */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Delivery Details</h2>

          <div className="space-y-6">
            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-green-100"></div>
                  <div className="w-1 h-12 bg-green-300"></div>
                </div>
                <div>
                  <p className="font-semibold">Order Confirmed</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-green-100"></div>
                  <div className="w-1 h-12 bg-green-300"></div>
                </div>
                <div>
                  <p className="font-semibold">Processing</p>
                  <p className="text-sm text-gray-600">We're preparing your order</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full border-4 border-yellow-100"></div>
                  <div className="w-1 h-12 bg-gray-300"></div>
                </div>
                <div>
                  <p className="font-semibold">Shipped</p>
                  <p className="text-sm text-gray-600">Estimated: 2-3 business days</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded-full border-4 border-gray-100"></div>
                </div>
                <div>
                  <p className="font-semibold">Delivered</p>
                  <p className="text-sm text-gray-600">We'll notify you</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-bold mb-4">Shipping To:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-orange-light rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-orange font-bold">1.</span>
              <span>You will receive order updates via email and SMS</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange font-bold">2.</span>
              <span>Your order will be shipped within 24-48 hours</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange font-bold">3.</span>
              <span>Track your order using the tracking number in your email</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange font-bold">4.</span>
              <span>You can return items within 7 days if needed</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="py-3 border-2 border-orange text-orange rounded font-bold hover:bg-orange-light transition-colors text-center"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="py-3 bg-orange text-white rounded font-bold hover:bg-orange-dark transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
