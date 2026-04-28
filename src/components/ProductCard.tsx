'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { FaHeart } from "react-icons/fa";

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  inStock: boolean
  category: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  rating,
  reviews,
  inStock,
}) => {
  const [isAdded, setIsAdded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const addItem = useCart((state) => state.addItem)
  const [liked, setLiked] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link href={`/product/${id}`}>
        <div className="relative w-full h-48 bg-gray-100">
          {!image || imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-200 text-center px-4">
              <span className="text-3xl">🛍️</span>
              <span className="text-sm text-gray-600">Image unavailable</span>
            </div>
          ) : (
            <Image
              src={image}
              alt={name}
              fill
              onError={() => setImageError(true)}
              className="object-cover hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-semibold text-sm mb-2 h-12 overflow-hidden text-ellipsis line-clamp-2 hover:text-orange">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-orange">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(rating) ? 'text-orange' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-600">{reviews} reviews</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-orange">₹ {price.toLocaleString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`flex-1 py-2 rounded font-semibold transition-all flex items-center justify-center gap-2 ${isAdded
                ? 'bg-green-500 text-white'
                : inStock
                  ? 'bg-orange text-white hover:bg-orange-dark'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            <FiShoppingCart size={16} />
            {isAdded ? 'Added' : inStock ? 'Add' : 'Out of Stock'}
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="p-2 border border-gray-300 rounded hover:border-orange hover:text-orange"
          >
            {liked ? (
              <FaHeart size={18} className="text-orange" />
            ) : (
              <FiHeart size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
