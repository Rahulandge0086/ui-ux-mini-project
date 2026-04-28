'use client'

import React, { useEffect, useState } from 'react'
import { ProductCard } from './ProductCard'

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

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId, category }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        const filteredProducts = data.products
          .filter((product: Product) => product.category === category && product.id !== currentProductId)
          .slice(0, 4)

        setRelatedProducts(filteredProducts)
      } catch (error) {
        console.error('Failed to load related products:', error)
        setRelatedProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchRelatedProducts()
    }
  }, [category, currentProductId])

  if (loading) {
    return <div className="text-sm text-gray-500">Loading related products...</div>
  }

  if (relatedProducts.length === 0) {
    return <div className="text-sm text-gray-500">No related products found.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {relatedProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}

export default RelatedProducts
