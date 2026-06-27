import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const q = request.nextUrl.searchParams.get('q')
  if (!q || q.length < 2) {
    return NextResponse.json({ cards: [] })
  }

  try {
    const isNumberSearch = q.includes('/')
    const parts = q.split('/')
    const rawNum = parts[0]
    const strippedNum = rawNum.replace(/^0+/, '') || rawNum
    const setTotal = parts[1] ? parseInt(parts[1], 10) : null

    if (isNumberSearch) {
      const numberClauses = [`number:"${rawNum}"`]
      if (strippedNum !== rawNum) {
        numberClauses.push(`number:"${strippedNum}"`)
      }
      const numberPart = numberClauses.length > 1
        ? `(${numberClauses.join(' OR ')})`
        : numberClauses[0]
      const qStr = setTotal
        ? `${numberPart} AND set.printedTotal:${setTotal}`
        : numberPart
      const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(qStr)}&pageSize=10`)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      return NextResponse.json({ cards: data.data || [] })
    }

    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(q)}*&pageSize=20&orderBy=set.releaseDate`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return NextResponse.json({ cards: data.data || [] })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 502 })
  }
}
