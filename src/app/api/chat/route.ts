import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { SimpleChatbot } from '@/lib/chatbot';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, messageType = 'user' } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Session ID and message are required' },
        { status: 400 }
      );
    }

    // Get or create session
    let session = await db.getSession(sessionId);
    if (!session) {
      session = await db.createSession(sessionId);
    }

    // Add user message to database
    await db.addMessage(sessionId, messageType, message);

    // Initialize chatbot with session state
    const chatbot = new SimpleChatbot();
    // In a real implementation, we'd restore the chatbot state from the session
    // For now, we'll rely on the frontend to manage the conversation flow

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await db.getSession(sessionId);
    const messages = await db.getMessages(sessionId);

    return NextResponse.json({
      session,
      messages
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
