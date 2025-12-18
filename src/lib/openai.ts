import OpenAI from 'openai';
import { searchKnowledge } from './knowledge-static';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEnhancedResponse(
  userResponse: string,
  questionContext: string,
  conversationHistory: string[]
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful assistant for Green Office Villas, a luxury work resort in the Dominican Republic.

    Key facts about Green Office Villas:
    - Location: Private "nature-first" work resort in Dominican Republic, 20 min east of Cabarete
    - Capacity: Phase 1 accommodates 55–110 guests (55 with private rooms, 110 with shared rooms)
    - Connectivity: Lightning-fast fiber internet + Starlink backup for 100% redundancy
    - Workspaces: Private villa offices with ergonomic chairs, dual monitors, panoramic boardrooms
    - Event Center: Seats up to 110, professional AV, stage, lighting
    - Villas: Classic Luxury (3-bed), Executive Luxury (4-5 bed), Executive Estate (11-bed)
    - Pricing: High Season from ~$2,250/night for 3-bed villa. Low Season ~25% off. Group discounts available.
    - Meals: Add-on packages $80-160+ pp/day
    - Team Building: GO Empower, Survivor Challenge, Pool Olympics, Donkey Polo, Top Chef (included)
    - Wellness: Hydrotherapy spa, lagoon pools, private beach (included)
    - Transportation: Puerto Plata (POP) transfer included

    Your role is to provide helpful, concise responses that guide users through the retreat planning process. Keep responses under 150 words and always maintain a professional, friendly tone.`;

    const userPrompt = `Question context: ${questionContext}
    User response: ${userResponse}
    Recent conversation: ${conversationHistory.slice(-3).join('\n')}

    Please provide a helpful response that acknowledges their input and provides relevant information about Green Office Villas.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Thank you for your response. Let me help you with more information about Green Office Villas.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "Thank you for your response. I'm here to help you learn more about Green Office Villas and plan your perfect retreat.";
  }
}

export async function generateKnowledgeResponse(query: string): Promise<string> {
  // First, try the static knowledge base for exact matches
  const staticResponse = searchKnowledge(query);

  // If we got a match from static knowledge base (not the default fallback message), use it
  if (staticResponse && !staticResponse.includes("try rephrasing your question")) {
    return staticResponse;
  }

  // Otherwise, use OpenAI for more complex queries
  try {
    const systemPrompt = `You are a friendly, concise, and professional customer service associate for Green Office Villas, a luxury work resort in the Dominican Republic.

Your tone is warm, enthusiastic, and helpful. Keep responses short (under 200 words), clear, and positive. Use simple language.

Key Facts about Green Office Villas:
- Location: Private "nature-first" work resort in Dominican Republic, 20 min east of Cabarete
- Capacity: Phase 1 accommodates 55–110 guests (55 with private rooms, 110 with shared rooms)
- Target: Corporate retreats, innovation sessions, employee rewards, executive workcations
- Connectivity: Lightning-fast fiber internet + Starlink backup for 100% redundancy
- Workspaces: Private villa offices with ergonomic chairs, dual monitors, panoramic boardrooms
- Event Center: Seats up to 110, professional AV, stage, lighting
- Villas: Classic Luxury (3-bed), Executive Luxury (4-5 bed), Executive Estate (11-bed)
- Pricing: High Season (Dec-Apr) from ~$2,250/night for 3-bed villa. Low Season ~25% off. Group discounts available.
- Meals: Add-on packages $80-160+ pp/day (Essentials, Executive, Private Chef)
- Team Building: GO Empower, Survivor Challenge, Pool Olympics, Donkey Polo, Top Chef (included)
- Adventures: Kitesurfing, canyoning, whale watching, ziplines (add-on via GO Adventures Concierge)
- Wellness: Hydrotherapy spa, lagoon pools, private beach, beach bar (included). Massages add-on.
- Transportation: Puerto Plata (POP) transfer included (~20-30 min). Other airports available.
- Booking: 20% deposit, balance 30 days prior
- Cancellation: 60+ days = 50% refund, 30-60 days = non-refundable, <30 days = full payment non-refundable

Always end with a helpful transition like "Is there anything else you'd like to know?" or "How else can I assist you today?"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "I'd be happy to help you with information about Green Office Villas. Could you please rephrase your question?";
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to static knowledge base search result
    return staticResponse;
  }
}
