import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import { verifyPassword, createSession, destroySession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const action = formData.get('_action')

  if (action === 'login') {
    const password = formData.get('password') as string
    if (!password || !verifyPassword(password)) {
      redirect('/admin?error=invalid')
    }
    await createSession()
    redirect('/admin')
  }

  if (action === 'logout') {
    await destroySession()
    redirect('/admin')
  }

  redirect('/admin')
}
