import { redirect, notFound } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { getCard } from "@/lib/data"
import CardForm from "@/components/CardForm"

export default async function EditCardPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const authed = await isAuthenticated()
  if (!authed) redirect('/admin')

  const card = await getCard(id)
  if (!card) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Card: {card.name}</h1>
      <CardForm card={card} />
    </div>
  )
}
