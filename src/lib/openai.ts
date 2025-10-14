import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEnhancedResponse(
  userResponse: string,
  questionContext: string,
  conversationHistory: string[]
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful assistant for Green Office Villas, a premium eco-friendly retreat venue in the Dominican Republic.

    Key facts about Green Office Villas:
    - Located in the Dominican Republic with Caribbean-inspired architecture
    - Private villas with integrated office spaces
    - High-speed, reliable internet and modern amenities
    - Accommodates up to 50 guests currently, expanding to 300+ by 2027-2028
    - Eco-friendly and sustainable practices
    - Packages start under $500 (daily) per person
    - Offers team-building, work-focused, and relaxation activities
    - Free shuttle service from Puerto Plata (POP) and Santiago (STI) airports

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
  try {
    const systemPrompt = `You are a knowledgeable assistant for Green Office Villas. Answer questions accurately based on these facts:

    - Location: Dominican Republic with Caribbean-inspired architecture
    - Accommodation: Private villas with integrated office spaces
    - Capacity: Up to 50 guests (expanding to 300+ by 2027-2028)
    - Internet: High-speed, reliable internet with multiple access points
    - Pricing: Packages start under $500 (daily) per person
    - Transportation: Free shuttle from Puerto Plata (POP) and Santiago (STI) airports
    - Sustainability: 100% renewable energy, zero-waste initiatives, organic gardens, carbon offsets
    - Activities: Team-building, outdoor adventures, cultural experiences, wellness programs
    - Dining: Organic, locally-sourced meals with dietary accommodations (vegan, vegetarian, gluten-free)
    - Amenities: Ergonomic office spaces, docking stations with dual monitors, meeting rooms, projectors, whiteboards, video conferencing
    - Visa: USA, Canada, Europe generally don't require visa

    Keep responses concise (under 200 words) and helpful. If you don't have specific information, suggest they contact the team for details.`;

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
    // Fallback to static knowledge base
    return "I'm here to help with information about Green Office Villas. Please try rephrasing your question, or ask about our location, pricing, amenities, or booking process.";
  }
}
