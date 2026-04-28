'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { useAuth } from '@/store/authStore'
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartItems = useCart((state) => state.getTotalItems())
  const { user, logout } = useAuth()

  const categories = [
    { label: 'All', href: '/' },
    { label: 'Electronics', href: '/?category=electronics' },
    { label: 'Men', href: '/?category=men' },
    { label: 'Women', href: '/?category=women' },
    { label: 'Baby & Kids', href: '/?category=baby' },
    { label: 'Offers', href: '/?category=offers' },
    { label: 'TV & Appliances', href: '/?category=tv' },
    { label: 'Home & Furniture', href: '/?category=home' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[9999] shadow-sm">
      <div className="container-custom relative">
        {/* Top Navigation */}
        <div className="flex items-center justify-between gap-4 py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-none">
            <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">U</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">URBAN CART</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 min-w-0 mx-0 md:mx-6 max-w-2xl">
            <div className="flex w-full min-w-0">
              <input
                type="text"
                placeholder="Search iPhone 17 pro..."
                className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button className="bg-orange text-white px-4 py-2 rounded-r-lg hover:bg-orange-dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 md:gap-6 flex-none">
            <Link href="/" className="text-sm hover:text-orange hidden md:block">
              Hello, Rahul
            </Link>
            <Link href="/shop" className="text-sm hover:text-orange hidden md:block">
              Shop
            </Link>
            <Link href="/orders" className="text-sm hover:text-orange hidden md:block">
              Orders
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm hidden md:inline">{user.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm hover:text-orange"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 text-sm hover:text-orange"
              >
                <FiUser size={18} />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative">
              <FiShoppingCart size={24} className="hover:text-orange" />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full border border-gray-200 bg-white shadow-sm"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="hidden md:flex gap-6 py-3 border-t border-gray-200 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="text-sm font-medium hover:text-orange whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full z-50 py-4 border-t border-gray-200 bg-white shadow-xl rounded-b-xl">
            <div className="grid gap-2 px-2">
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange/10 hover:text-orange"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/orders"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange/10 hover:text-orange"
                onClick={() => setMobileMenuOpen(false)}
              >
                Orders
              </Link>
              
              {/* Auth Section */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-700">Hi, {user.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-left rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange/10 hover:text-orange flex items-center gap-2"
                    >
                      <FiLogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange/10 hover:text-orange flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser size={18} />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
