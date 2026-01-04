import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const cookieStore = cookies()
  const { conversationId } = params

  if (!conversationId) {
    return new NextResponse(JSON.stringify({ error: 'conversationId is required' }), { status: 400 })
  }

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

  // First, verify the user has access to this conversation
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single()

  if (convError || !conversation) {
    return new NextResponse(JSON.stringify({ error: 'Conversation not found or access denied' }), { status: 404 })
  }

  // If access is verified, fetch the messages
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (messagesError) {
    return new NextResponse(JSON.stringify({ error: messagesError.message }), { status: 500 })
  }

  return NextResponse.json(messages)
}