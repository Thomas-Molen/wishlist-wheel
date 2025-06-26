'use client'

import { FormEvent } from "react";
import { useRef, useState } from 'react';

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState<boolean>(false)

  function SearchSteam(e: FormEvent) {
    e.preventDefault();
    setSearching(true);

    const steamRef = inputRef?.current?.value.trim()

    if (steamRef === undefined || steamRef === '') return;

    console.log(steamRef)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="tracking-tight border border-muted rounded-md flex flex-col p-6 max-w-md">
        <div className="flex flex-col gap-y-3 text-center mb-8">
          <h1 className="text-2xl font-bold">
            Steam Wishlist Wheel
          </h1>
          <h2 className="text-sm text-secondary">
            Enter your Steam ID or profile URL to create a spinning wheel of your wishlist games
          </h2>
        </div>
        <form onSubmit={SearchSteam} className="flex flex-col gap-y-3">
          <label className="text-sm font-medium" htmlFor="steamRef">Steam ID or Profile URL</label>
          <input className="border border-muted rounded-md px-3 py-2"
            ref={inputRef}
            id="steamRef"
            name="steamRef"
            placeholder="76561198209138859 or https://steamcommunity.com/id/username" />
          <button
            className={`${searching ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"} transition-colors rounded-md p-2`}
            type="submit"
            disabled={searching}>
            Create Wheel
          </button>
        </form>
      </div>
    </div>
  );
}
