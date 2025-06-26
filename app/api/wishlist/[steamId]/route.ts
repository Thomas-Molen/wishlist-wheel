import type { SteamAppDetailsResponse, WishlistResponse } from '@/types/steam'
import type { WishlistItem } from '@/types/wishlist'
import { NextRequest, NextResponse } from 'next/server'

const appCache = new Map<number, SteamAppDetailsResponse>();

export async function GET(req: NextRequest) {
    const steamId = req.nextUrl.pathname.split('/').pop()

    if (steamId === undefined) {
        return NextResponse.json({ error: 'No valid steam ID was provided as path suffix' }, { status: 400 }); 
    }

    try {
        const wishlistItemPromises = (await GetWishlist(steamId)).response.items.map(async (i) => {
            const app = await GetApp(i.appid);

            return {
                name: app[i.appid].data.name,
                priority: i.priority
            } as WishlistItem;
        });

        const wishlist: WishlistItem[] = await Promise.all(wishlistItemPromises);

        return NextResponse.json(wishlist);
    }
    catch {
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }

}

async function GetWishlist(steamId: string): Promise<WishlistResponse> {
    const steamApiUrl = `https://api.steampowered.com/IWishlistService/GetWishList/v1/?steamid=${steamId}`
    const res = await fetch(steamApiUrl)
    return await res.json()
}

async function GetApp(appId: number): Promise<SteamAppDetailsResponse> {
    let app = appCache.get(appId)
    if (app !== undefined) {
        return app
    }

    const steamApiUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}`
    const res = await fetch(steamApiUrl)
    app = await res.json()

    if (app === undefined) {
        throw new Error(`Failed to retrieve app ${appId}`)
    }

    appCache.set(appId, app)

    return app
}