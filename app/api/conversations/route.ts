import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return NextResponse.json(conversations)
}

export async function POST(req: Request) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { title } = await req.json()

  if (!title) {
    return new NextResponse(JSON.stringify({ error: 'Title is required' }), { status: 400 })
  }

  const { data: newConversation, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title })
    .select()
    .single()

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return NextResponse.json(newConversation)
}