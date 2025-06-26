'use client'

import { SpinningWheel } from '@/app/components/SpinningWheel'
import { WishlistItem } from '@/types/wishlist'
import { use, useEffect, useState } from 'react'

export default function Page({ params }: { params: Promise<{ steamId: string }> }) {
  const { steamId } = use(params)

  const [wishlist, setWishlist] = useState<WishlistItem[]>()

  useEffect(() => {
    fetch(`/api/wishlist/${steamId}`)
      .then(res => res.json())
      .then(wl => setWishlist((wl as WishlistItem[]).sort((a, b) => a.priority - b.priority)))
  }, [steamId])

  if (wishlist === undefined) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <SpinningWheel
        items={wishlist.slice(0, 10).map(app => {
          return {
            name: app.name,
            priority: app.priority,
            backgroundImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/235460/header.jpg?t=1740076034"
          }
        })} 
        size={800}/>
      <hr />
      {wishlist.map(app =>
        <div key={app.name}>
          <p>{app.name} | {app.priority}</p>
        </div>
      )}
    </div>
  )
}
