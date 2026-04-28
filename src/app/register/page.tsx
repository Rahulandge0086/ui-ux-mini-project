'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/authStore'
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi'

export default function Register() {
  const router = useRouter()
  const { register, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [localError, setLocalError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
    setLocalError('')

    // Calculate password strength
    if (name === 'password') {
      let strength = 0
      if (value.length >= 6) strength++
      if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength++
      if (value.match(/[0-9]/)) strength++
      if (value.match(/[^a-zA-Z0-9]/)) strength++
      setPasswordStrength(strength)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      setLocalError('Name is required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    try {
      await register(formData.email, formData.password, formData.name)
      router.push('/')
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed')
    }
  }

  const passwordStrengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const passwordStrengthColor = [
    'bg-red-500',
    'bg-orange',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
  ]

  return (
    <div className="min-h-screen flex items-center bg-white text-black justify-center py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h1 className="text-3xl font-bold text-black">URBAN CART</h1>
          <p className="text-black/60 mt-2">Join Our Community</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange-light"
                  placeholder="aryan"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange-light"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange-light"
                  placeholder="••••••••"
                  required
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrengthColor[passwordStrength]
                        }`}
                        style={{
                          width: `${((passwordStrength + 1) / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrengthText[passwordStrength]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use uppercase, lowercase, numbers, and symbols for strong password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange-light"
                  placeholder="••••••••"
                  required
                />
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                  <FiCheck size={16} />
                  Passwords match
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 my-4">
              <input type="checkbox" className="w-4 h-4 text-orange rounded mt-1" required />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="#" className="text-orange font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-orange font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange text-white py-3 rounded-lg font-bold hover:bg-orange-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <FiArrowRight size={20} />}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-orange font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 text-black">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="mb-2">✓</div>
              <p>Fast Checkout</p>
            </div>
            <div>
              <div className="mb-2">✓</div>
              <p>Track Orders</p>
            </div>
            <div>
              <div className="mb-2">✓</div>
              <p>Easy Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
