import { google } from '@ai-sdk/google';
import {
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const POST = async (req: Request): Promise<Response> => {
  const cookieStore = cookies();
  const body = await req.json();
  const { messages, conversationId }: { messages: UIMessage[], conversationId: string } = body;

  if (!conversationId) {
    return new NextResponse(JSON.stringify({ error: 'conversationId is required' }), { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Save the user's message
  const userMessage = messages[messages.length - 1];
  if (userMessage.role === 'user') {
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: userMessage.content,
    });
  }

  const modelMessages = [
    {
      role: 'system' as const,
      content: "You are an AI tutor for an application named 'Pepper'. Your goal is to help users learn and understand various topics. Be friendly, encouraging, and provide clear explanations. The user is currently interacting with you in a chat interface within the Pepper application.",
    },
    ...messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: typeof msg.content === 'string' ? msg.content : '',
    })),
  ];

  const streamTextResult = streamText({
    model: google(process.env.GOOGLE_GEMINI_MODEL as string),
    messages: modelMessages,
    async onFinish({ text }) {
      // Save the assistant's response
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: text,
      });
    },
  });

  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({
    stream,
  });
};
