'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { FiFilter, FiChevronDown } from 'react-icons/fi'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  inStock: boolean
  category: string
  battery?: string
}

const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹50,000', min: 10000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: Infinity },
]

const CATEGORIES = [
  'All',
  'Electronics',
  'Men',
  'Women',
  'Baby & Kids',
  'Home & Furniture',
  'TV & Appliances',
]

const BATTERY_OPTIONS = [
  '2000-2499 mAh',
  '2500-2999 mAh',
  '3000-3499 mAh',
  '3500-3999 mAh',
  '4000-4999 mAh',
  '5000-5999 mAh',
]

export default function Shop() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  )
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null)
  const [selectedBattery, setSelectedBattery] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data.products)
        setFilteredProducts(data.products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = products

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (p) => p.category === selectedCategory
      )
    }

    // Price filter
    if (selectedPrice) {
      filtered = filtered.filter(
        (p) => p.price >= selectedPrice.min && p.price <= selectedPrice.max
      )
    }

    // Battery filter
    if (selectedBattery.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBattery.includes(p.battery || '')
      )
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, selectedPrice, selectedBattery, searchQuery, products])

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Sidebar Filters */}
        <div
          className={`lg:col-span-1 ${
            mobileFilterOpen ? 'block fixed inset-0 z-40 bg-white overflow-y-auto' : 'hidden'
          } lg:block lg:static lg:inset-auto lg:z-auto lg:bg-white lg:overflow-visible`}
        >
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="lg:hidden mb-4 text-gray-600 font-semibold"
          >
            ← Back
          </button>

          <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FiFilter size={18} />
                Search
              </h3>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange"
              />
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-bold mb-3">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4 text-orange"
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-bold mb-3">Price</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={
                        selectedPrice?.min === range.min &&
                        selectedPrice?.max === range.max
                      }
                      onChange={() => setSelectedPrice(range)}
                      className="w-4 h-4 text-orange"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
                {selectedPrice && (
                  <button
                    onClick={() => setSelectedPrice(null)}
                    className="text-sm text-orange hover:underline mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Battery Capacity Filter */}
            <div>
              <h3 className="font-bold mb-3">Battery Capacity</h3>
              <div className="space-y-2">
                {BATTERY_OPTIONS.map((battery) => (
                  <label key={battery} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBattery.includes(battery)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBattery([...selectedBattery, battery])
                        } else {
                          setSelectedBattery(
                            selectedBattery.filter((b) => b !== battery)
                          )
                        }
                      }}
                      className="w-4 h-4 text-orange"
                    />
                    <span className="text-sm">{battery}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'All' ||
              selectedPrice ||
              selectedBattery.length > 0 ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedPrice(null)
                  setSelectedBattery([])
                  setSearchQuery('')
                }}
                className="w-full py-2 bg-orange text-white rounded font-semibold hover:bg-orange-dark"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden mb-6 flex items-center gap-2 bg-orange text-white px-4 py-2 rounded"
          >
            <FiFilter size={18} />
            Filters
          </button>

          {/* Results Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-xl text-gray-500">Loading products...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-xl text-gray-500">No products found</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
