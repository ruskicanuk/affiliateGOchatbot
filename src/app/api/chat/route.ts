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

    // Get or create session using robust handling
    const session = await db.getOrCreateSession(sessionId);
    if (!session) {
      // If we can't get or create a session, continue without database persistence
      console.warn('Unable to get or create session, continuing without persistence');
      return NextResponse.json({
        success: true,
        sessionId: sessionId,
        warning: 'Session not persisted to database'
      });
    }

    // Add user message to database (with error handling)
    try {
      await db.addMessage(sessionId, messageType, message);
    } catch (error) {
      console.warn('Failed to persist message to database:', error);
      // Continue without failing the request
    }

    // Initialize chatbot with session state
    const chatbot = new SimpleChatbot();
    // In a real implementation, we'd restore the chatbot state from the session
    // For now, we'll rely on the frontend to manage the conversation flow

    return NextResponse.json({
      success: true,
      sessionId: session?.sessionId || sessionId
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

    try {
      const session = await db.getOrCreateSession(sessionId);
      const messages = await db.getMessages(sessionId);

      return NextResponse.json({
        session,
        messages
      });
    } catch (error) {
      console.warn('Failed to get session/messages from database:', error);
      return NextResponse.json({
        session: null,
        messages: [],
        warning: 'Database not available'
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
