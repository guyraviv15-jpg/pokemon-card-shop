import fs from 'node:fs'
import path from 'node:path'
import type { PokemonCard, CardFormData } from './types'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const CARDS_FILE = path.join(DATA_DIR, 'cards.json')
const KV_KEY = 'pokemon_cards'

let kv: import('@upstash/redis').Redis | null = null

function initKv() {
  if (kv) return kv
  const url = process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    const { Redis } = require('@upstash/redis') as typeof import('@upstash/redis')
    kv = new Redis({ url, token })
  }
  return kv
}

function isKvAvailable(): boolean {
  return !!initKv()
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

async function readCardsFromKv(): Promise<PokemonCard[]> {
  try {
    const data = await kv!.get<PokemonCard[]>(KV_KEY)
    return data || []
  } catch {
    return []
  }
}

async function writeCardsToKv(cards: PokemonCard[]): Promise<void> {
  try {
    await kv!.set(KV_KEY, cards)
  } catch {
    // fallback to file
  }
}

function readCardsFromFile(): PokemonCard[] {
  ensureDataDir()
  if (!fs.existsSync(CARDS_FILE)) {
    fs.writeFileSync(CARDS_FILE, '[]', 'utf-8')
    return []
  }
  const raw = fs.readFileSync(CARDS_FILE, 'utf-8')
  return JSON.parse(raw)
}

function writeCardsToFile(cards: PokemonCard[]) {
  ensureDataDir()
  fs.writeFileSync(CARDS_FILE, JSON.stringify(cards, null, 2), 'utf-8')
}

async function readCards(): Promise<PokemonCard[]> {
  if (isKvAvailable()) return readCardsFromKv()
  return readCardsFromFile()
}

export async function writeCards(cards: PokemonCard[]): Promise<void> {
  if (isKvAvailable()) {
    await writeCardsToKv(cards)
  }
  writeCardsToFile(cards)
}

export async function getCards(): Promise<PokemonCard[]> {
  return readCards()
}

export async function getCard(id: string): Promise<PokemonCard | undefined> {
  const cards = await readCards()
  return cards.find(c => c.id === id)
}

export async function getCardBySlug(slug: string): Promise<PokemonCard | undefined> {
  const cards = await readCards()
  return cards.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === slug)
}

export async function createCard(data: CardFormData): Promise<PokemonCard> {
  const cards = await readCards()
  const card: PokemonCard = {
    ...data,
    id: crypto.randomUUID(),
    isSold: false,
    createdAt: new Date().toISOString(),
  }
  cards.push(card)
  await writeCards(cards)
  return card
}

export async function updateCard(id: string, data: Partial<CardFormData>): Promise<PokemonCard | undefined> {
  const cards = await readCards()
  const index = cards.findIndex(c => c.id === id)
  if (index === -1) return undefined
  cards[index] = { ...cards[index], ...data }
  await writeCards(cards)
  return cards[index]
}

export async function deleteCard(id: string): Promise<boolean> {
  const cards = await readCards()
  const index = cards.findIndex(c => c.id === id)
  if (index === -1) return false
  cards.splice(index, 1)
  await writeCards(cards)
  return true
}

export async function getSets(): Promise<string[]> {
  const cards = await readCards()
  return [...new Set(cards.map(c => c.set))].sort()
}

export async function getTypes(): Promise<string[]> {
  const cards = await readCards()
  return [...new Set(cards.map(c => c.type))].sort()
}

export async function getRarities(): Promise<string[]> {
  const cards = await readCards()
  return [...new Set(cards.map(c => c.rarity))].sort()
}


