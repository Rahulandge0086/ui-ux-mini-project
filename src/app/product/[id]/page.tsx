'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import RelatedProducts from '@/components/RelatedProducts'
import { FiArrowLeft, FiShoppingCart, FiHeart, FiTruck, FiShield } from 'react-icons/fi'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  battery?: string
  color?: string[]
  inStock: boolean
}

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [isAdded, setIsAdded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const addItem = useCart((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        setProduct(data.product)
        if (data.product.color) {
          setSelectedColor(data.product.color[0])
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        color: selectedColor,
      })
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-12 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-orange hover:underline"
          >
            <FiArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-orange hover:underline mb-8"
      >
        <FiArrowLeft size={18} />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg p-4 sm:p-8">
          <div className="relative w-full h-60 sm:h-96 bg-gray-100 rounded-lg overflow-hidden">
            {!product.image || imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-200 text-center px-4">
                <span className="text-4xl">🛍️</span>
                <span className="text-sm text-gray-600">Image unavailable</span>
              </div>
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                onError={() => setImageError(true)}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          {product.color && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Color:</h3>
              <div className="flex gap-3">
                {product.color.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-orange scale-110'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Category */}
          <div>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex text-orange">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'text-orange' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="bg-orange-light rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Price</p>
            <p className="text-4xl font-bold text-orange">
              ₹ {product.price.toLocaleString()}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About this product</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Battery Info */}
          {product.battery && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Battery Capacity</h3>
              <p className="text-gray-700">{product.battery}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:border-orange"
              >
                −
              </button>
              <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:border-orange"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-4 rounded font-semibold transition-all flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : product.inStock
                  ? 'bg-orange text-white hover:bg-orange-dark'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart size={20} />
              {isAdded ? 'Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="flex-1 py-4 border-2 border-orange text-orange rounded font-semibold hover:bg-orange-light transition-colors flex items-center justify-center gap-2">
              <FiHeart size={20} />
              Wishlist
            </button>
          </div>

          {/* Delivery Info */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <div className="flex items-start gap-4">
              <FiTruck className="text-orange mt-1" size={20} />
              <div>
                <p className="font-semibold">FREE Delivery</p>
                <p className="text-sm text-gray-600">on orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiShield className="text-orange mt-1" size={20} />
              <div>
                <p className="font-semibold">1 Year Warranty</p>
                <p className="text-sm text-gray-600">on manufacturing defects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </div>
  )
}
