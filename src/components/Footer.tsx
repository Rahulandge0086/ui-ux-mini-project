'use client'

import React from 'react'
import Link from 'next/link'
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-orange text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="font-bold text-lg mb-4">ABOUT</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-lg mb-4">HELP</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Payments
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Consumer Policy */}
          <div>
            <h4 className="font-bold text-lg mb-4">CONSUMER POLICY</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Cancellation & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-lg mb-4">CONNECT WITH US</h4>
            <p className="text-sm mb-4">
              At your fingertips - Twitter - Phone
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:opacity-80">
                <FiFacebook size={20} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <FiTwitter size={20} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <FiInstagram size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-light py-6 text-center text-sm">
          <p>&copy; 2026 Urban Cart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
