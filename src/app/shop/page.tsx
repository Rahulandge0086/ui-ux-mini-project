import { Suspense } from 'react'
import { ShopContent } from './ShopContent'

function ShopLoading() {
  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    </div>
  )
}

export default function Shop() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  )
}
