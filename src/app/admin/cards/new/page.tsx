import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import CardForm from "@/components/CardForm"

export default async function NewCardPage() {
  const authed = await isAuthenticated()
  if (!authed) redirect('/admin')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Card</h1>
      <CardForm />
    </div>
  )
}
