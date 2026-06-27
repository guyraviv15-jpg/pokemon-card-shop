/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCards } from "@/lib/data"
import { isAuthenticated } from "@/lib/auth"
import DeleteButton from "@/components/DeleteButton"

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

export default async function AdminCardsPage() {
  const authed = await isAuthenticated()
  if (!authed) redirect('/admin')

  const cards = await getCards()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Cards</h1>
        <Link
          href="/admin/cards/new"
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          + Add Card
        </Link>
      </div>

      {cards.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No cards yet. Add your first card!</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Card</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Set</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Rarity</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Condition</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Price</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Qty</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map(card => (
                <tr key={card.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-gray-100 rounded flex items-center justify-center shrink-0">
                        {card.imageUrl ? (
                          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-lg">🃏</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{card.name}</p>
                        <p className="text-xs text-gray-500">#{card.number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{card.set}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rarityColor(card.rarity)}`}>
                      {card.rarity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{card.condition}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">${card.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-center">{card.quantity}</td>
                  <td className="px-4 py-3 text-center">
                    {card.isSold ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Sold</span>
                    ) : card.quantity > 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">Out</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/cards/${card.id}/edit`}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <DeleteButton cardId={card.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
