import { NextRequest, NextResponse } from 'next/server';
import { generateKnowledgeResponse, generateEnhancedResponse } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { query, type, context } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    let response: string;

    if (type === 'knowledge') {
      response = await generateKnowledgeResponse(query);
    } else if (type === 'enhanced' && context) {
      response = await generateEnhancedResponse(
        query,
        context.questionContext || '',
        context.conversationHistory || []
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid request type or missing context' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      response,
      success: true
    });

  } catch (error) {
    console.error('OpenAI API route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
