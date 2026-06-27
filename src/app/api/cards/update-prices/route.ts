import { redirect } from "next/navigation"
import { getCards, writeCards } from "@/lib/data"
import { isAuthenticated } from "@/lib/auth"

async function fetchPrice(name: string, set: string, number: string): Promise<number | null> {
  const numPart = number.split('/')[0].replace(/^0+/, '') || number.split('/')[0]
  const encodedName = encodeURIComponent(name)
  const encodedSet = encodeURIComponent(set)

  const queries = [
    `name:"${encodedName}" AND set.name:"${encodedSet}"`,
    `name:"${encodedName}" AND number:"${numPart}"`,
    `name:"${encodedName}"`,
  ]

  for (const query of queries) {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=${query}&pageSize=3`)
    if (!res.ok) continue
    const data = await res.json()
    const card = data.data?.[0]
    if (card?.tcgplayer?.prices) {
      const prices = card.tcgplayer.prices
      const pref = prices.holofoil?.market || prices.reverseHolofoil?.market || prices.normal?.market
      if (pref) return pref
    }
  }

  return null
}

export async function POST() {
  const authed = await isAuthenticated()
  if (!authed) {
    redirect('/admin')
  }

  const cards = getCards()
  const results: { name: string; oldPrice: number; newPrice: number | null }[] = []

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    if (card.isSold) continue

    await new Promise(r => setTimeout(r, 200))
    const marketPrice = await fetchPrice(card.name, card.set, card.number)

    results.push({
      name: card.name,
      oldPrice: card.price,
      newPrice: marketPrice,
    })

    if (marketPrice !== null) {
      cards[i].price = Math.round(marketPrice * 100) / 100
    }
  }

  writeCards(cards)

  const updated = results.filter(r => r.newPrice !== null).length
  redirect(`/admin?prices=${updated}&total=${cards.length}`)
}
