// Static knowledge base - no database needed for POC
export const KNOWLEDGE_BASE = {
  "pricing": {
    keywords: ["price", "cost", "pricing", "budget", "rates", "expensive", "cheap", "affordable"],
    response: "Packages start at $800 per person for 3-day retreats, including accommodation in private villas with integrated office spaces, high-speed internet, and eco-friendly amenities. Pricing varies based on group size, season, and specific requirements. For detailed quotes, we'd be happy to discuss your specific needs!"
  },
  "location": {
    keywords: ["location", "where", "address", "tropical", "bali", "southeast asia", "place"],
    response: "Green Office Villas is located in a tropical paradise with Bali-inspired architecture in Southeast Asia. The eco-resort setting provides a serene environment perfect for productive team retreats while maintaining connectivity to modern amenities and transportation hubs."
  },
  "amenities": {
    keywords: ["amenities", "facilities", "features", "wifi", "internet", "office", "workspace"],
    response: "Private villas with integrated office spaces, high-speed internet (fiber optic), ergonomic furniture, dedicated work areas, seamless indoor-outdoor flow, eco-friendly features, meeting rooms, recreational facilities, and 24/7 tech support for uninterrupted productivity."
  },
  "booking": {
    keywords: ["book", "reserve", "availability", "schedule", "dates", "when"],
    response: "To check availability and book your retreat, we'll need to know your preferred dates, group size, and specific requirements. Our team will work with you to customize the perfect retreat experience. Contact us to start planning your productive getaway!"
  },
  "capacity": {
    keywords: ["capacity", "size", "how many", "attendees", "guests", "people"],
    response: "Current capacity accommodates up to 50 guests in Phase 1. We're expanding to serve up to 400 guests by 2027-2028. For groups of 51-400, we maintain a waitlist and provide updates on availability as we expand our facilities."
  },
  "sustainability": {
    keywords: ["eco", "green", "sustainable", "environment", "carbon", "renewable"],
    response: "Green Office Villas is committed to sustainability with renewable energy systems, water conservation, locally-sourced materials, waste reduction programs, and carbon-neutral operations. We believe productive retreats and environmental responsibility go hand in hand."
  },
  "activities": {
    keywords: ["activities", "team building", "recreation", "fun", "entertainment"],
    response: "We offer various team-building activities, outdoor adventures, wellness programs, cultural experiences, and recreational facilities. Activities can be customized to your team's preferences and retreat goals, balancing work productivity with team bonding."
  },
  "food": {
    keywords: ["food", "meals", "dining", "restaurant", "catering", "dietary"],
    response: "We provide healthy, locally-sourced meals with options for various dietary requirements including vegetarian, vegan, gluten-free, and other special needs. Our culinary team focuses on nutritious meals that fuel productivity and team collaboration."
  }
};

export function searchKnowledge(query: string): string {
  // Simple keyword matching instead of complex algorithms
  const lowercaseQuery = query.toLowerCase();
  
  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    if (data.keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      return data.response;
    }
  }
  
  return "I can help with Green Office Villas info—try rephrasing your question or ask about our location, pricing, amenities, booking process, capacity, sustainability efforts, activities, or dining options.";
}
