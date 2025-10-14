import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId parameter required' }, { status: 400 });
    }

    // Run debug analysis on the session
    const debugResults = await db.debugSession(sessionId);

    // Also test connection
    const connectionStatus = await db.checkConnection();

    return NextResponse.json({
      sessionId,
      connectionStatus,
      debugResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({
      error: 'Failed to debug session',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId } = await request.json();

    if (action === 'cleanup-duplicates') {
      await db.cleanupDuplicateSessions();
      return NextResponse.json({ success: true, message: 'Duplicate sessions cleaned up' });
    }

    if (action === 'test-session' && sessionId) {
      // Test creating and retrieving a session
      try {
        const session = await db.getOrCreateSession(sessionId);
        return NextResponse.json({
          success: true,
          session,
          message: 'Session test completed successfully'
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : String(error),
          message: 'Session test failed'
        });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Debug session POST error:', error);
    return NextResponse.json({
      error: 'Failed to process debug action',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
