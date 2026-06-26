/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import type { PokemonCard } from "@/lib/types"

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function rarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    'Common': 'bg-gray-100 text-gray-700',
    'Uncommon': 'bg-green-100 text-green-700',
    'Rare': 'bg-blue-100 text-blue-700',
    'Holo Rare': 'bg-yellow-100 text-yellow-700',
    'Ultra Rare': 'bg-purple-100 text-purple-700',
    'Secret Rare': 'bg-red-100 text-red-700',
  }
  return colors[rarity] || 'bg-gray-100 text-gray-700'
}

export default function CardGrid({ cards }: { cards: PokemonCard[] }) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">No cards found.</p>
      </div>
    )
  }

  return (
    <div className="card-grid">
      {cards.map(card => (
        <Link
          key={card.id}
          href={`/cards/${slugify(card.name)}`}
          className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-red-200 transition-all"
        >
          <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center p-4">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            ) : (
              <span className="text-4xl">🃏</span>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900">{card.name}</h3>
              <span className="text-xs text-gray-500">{card.number}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{card.set}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rarityColor(card.rarity)}`}>
                {card.rarity}
              </span>
              <span className="text-xs text-gray-500">{card.condition}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-red-600">
                ${card.price.toFixed(2)}
              </span>
              {card.quantity > 1 && (
                <span className="text-xs text-gray-400">Qty: {card.quantity}</span>
              )}
              {card.quantity === 0 && (
                <span className="text-xs text-red-500 font-medium">Sold Out</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
