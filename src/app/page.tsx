'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import { FiArrowRight } from 'react-icons/fi'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  inStock: boolean
  category: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-orange text-white">
        <div className="container-custom py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">Starting ₹199</h1>
              <p className="text-xl mb-6">Deals on Fashion & Beauty</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-orange px-8 py-3 rounded font-bold hover:bg-gray-light transition-colors"
              >
                Shop Now
                <FiArrowRight size={20} />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-orange-light rounded-lg p-8 text-center">
                <p className="text-orange font-bold">Featured Collection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Watch Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Watch Section</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Devices Section */}
      <section className="py-12 bg-gray-light">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Mobile Devices</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {products.slice(6, 12).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Kitchen Storage Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Kitchen Storage</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {products.filter((p) => p.category === 'Home & Furniture').map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Home Appliances Section */}
      <section className="py-12 bg-gray-light">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Home Appliances</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
