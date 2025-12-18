# Knowledge Base Documentation - User-Driven Q&A System

## Overview

This document outlines the knowledge base system that handles user-initiated questions when they select "Let me ask a question" during the bot-driven flow. The system provides accurate, concise responses and seamlessly returns users to the conversation flow.

## POC Implementation Note

**For the initial 2-week POC:**
- Knowledge base stored as static TypeScript file (not database)
- Simple keyword matching for search
- Basic categories: Pricing, Location, Amenities, Booking
- LLM integration for response generation when exact matches not found

## Knowledge Base Architecture (Simplified)

### Static Knowledge Base Structure
```typescript
// src/lib/knowledge-static.ts
export const KNOWLEDGE_BASE = {
  "pricing": {
    keywords: ["price", "cost", "pricing", "budget"],
    response: "Packages start at <$500 per attendee..."
  },
  "location": {
    keywords: ["location", "where", "address"],
    response: "Located in the Dominican Republic with Caribbean-inspired architecture..."
  },
  "amenities": {
    keywords: ["amenities", "facilities", "features"],
    response: "Private villas with integrated office spaces, high-speed internet..."
  },
  "booking": {
    keywords: ["book", "reserve", "availability"],
    response: "To check availability and book your retreat..."
  }
};

export function searchKnowledge(query: string) {
  const lowercaseQuery = query.toLowerCase();

  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    if (data.keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      return data.response;
    }
  }

  return "I can help with Green Office info—try rephrasing?";
}
```

### Response Guidelines
- **Concise**: Keep answers under 200 words
- **Factual**: Provide accurate, up-to-date information
- **Flow-Resuming**: Always end with transition back to conversation flow

### Fallback Response
For unmatched questions, use LLM with context:
"Let me help you with that. [LLM-generated response based on available knowledge]"

## Search & Matching Algorithm

### Keyword Matching
1. **Primary Keywords**: Direct topic matches (highest priority)
2. **Secondary Keywords**: Related terms and synonyms
3. **Contextual Keywords**: Broader category matches

### Semantic Understanding
- Handle variations in phrasing and terminology
- Recognize intent behind questions
- Match concepts even with different wording

### Multi-Topic Responses
When questions span multiple categories:
- Provide comprehensive answer covering all relevant aspects
- Prioritize most directly related information
- Include cross-references to related topics

### Confidence Scoring
- High confidence: Direct keyword and topic match
- Medium confidence: Related keywords or partial match
- Low confidence: Trigger clarification request

## Integration with Flow Management

### Integration Rules
- Save current flow position before knowledge base interaction
- Return to appropriate next question after providing answer
- Use previous user responses to enhance knowledge base answers
- Tailor responses to user's identified role and needs

Customer Service Chatbot Knowledge BasePersonaYou are a friendly, concise, and professional customer service associate.
Your tone is warm, helpful, and approachable. You keep responses short, clear, and to the point while maintaining politeness and professionalism. Always aim to resolve the user's issue quickly and effectively.Guidelines for ResponsesGreet users politely when appropriate (e.g., "Hello! How can I help you today?").
Use simple, non-technical language unless the user indicates otherwise.
Be empathetic when users express frustration (e.g., "I'm sorry you're experiencing this issue").
End responses with an offer to assist further if needed (e.g., "Is there anything else I can help you with?...

please restructure this as a knowledge base document that a chatbot uses to answer Q&A (its embedded inside an application).  Use the appropriate indentation, etc.  add a persona as well "you are a friendly, concise and professional customer service associate"# Knowledge Base Documentation - User-Driven Q&A System

## Overview

This document outlines the knowledge base system that handles user-initiated questions when they select "Let me ask a question" during the bot-driven flow. The system provides accurate, concise responses and seamlessly returns users to the conversation flow.## POC Implementation Note

**For the initial 2-week POC:**Knowledge base stored as static TypeScript file (not database)
Simple keyword matching for search
Basic categories: Pricing, Location, Amenities, Booking
LLM integration for response generation when exact matches not found

## Knowledge Base Architecture (Simplified)

### Static Knowledge Base Structure
typescript

// src/lib/knowledge-static.ts
export const KNOWLEDGE_BASE = {
  "pricing": {
    keywords: ["price", "cost", "pricing", "budget"],
    response: "Packages start at <$500 per attendee..."
  },
  "location": {
    keywords: ["location", "where", "address"],
    response: "Located in the Dominican Republic with Caribbean-inspired architecture..."
  },
  "amenities": {
    keywords: ["amenities", "facilities", "features"],
    response: "Private villas with integrated office spaces, high-speed internet..."
  },
  "booking": {
    keywords: ["book", "reserve", "availability"],
    response: "To check availability and book your retreat..."
  }
};

export function searchKnowledge(query: string) {
  const lowercaseQuery = query.toLowerCase();

  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    if (data.keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      return data.response;
    }
  }

  return "I can help with Green Office info—try rephrasing?";
}

### Response Guidelines
**Concise**: Keep answers under 200 words
**Factual**: Provide accurate, up-to-date information
**Flow-Resuming**: Always end with transition back to conversation flow

### Fallback Response
For unmatched questions, use LLM with context:
"Let me help you with that. [LLM-generated response based on available knowledge]"## Search & Matching Algorithm

### Keyword Matching
**Primary Keywords**: Direct topic matches (highest priority)
**Secondary Keywords**: Related terms and synonyms
**Contextual Keywords**: Broader category matches

### Semantic Understanding
Handle variations in phrasing and terminology
Recognize intent behind questions
Match concepts even with different wording

### Multi-Topic Responses
When questions span multiple categories:Provide comprehensive answer covering all relevant aspects
Prioritize most directly related information
Include cross-references to related topics

### Confidence Scoring
High confidence: Direct keyword and topic match
Medium confidence: Related keywords or partial match
Low confidence: Trigger clarification request

## Integration with Flow Management

### Integration Rules
Save current flow position before knowledge base interaction
Return to appropriate next question after providing answer
Use previous user responses to enhance knowledge base answers
Tailor responses to user's identified role and needs

This knowledge base system ensures users receive accurate, helpful information while maintaining the structured flow necessary for effective lead qualification.About Green Office Villas
Location & Setting
Keywords: location, where, address, tropical, Caribbean, Dominican Republic, noise, surroundings, Cabarete, map Content: Green Office is located in a tropical paradise in the Dominican Republic, situated 20 minutes east of the famous Cabarete and just 8 minutes from the nearest town. It is a "nature-first" location with no urban views or city sounds, designed to serve as a private sanctuary for strategy and focus.
•	Google Maps Location
Core Offering & Segments
Keywords: who is this for, target audience, corporate, startup, individual Content: We are a "Work Resort" designed for four specific segments:
   Corporate Retreats: For strategy sessions, leadership retreats, and all-hands gatherings focused on strengthening relationships.
   Innovation & Product Launches: For incubators and accelerators needing tech-enabled spaces to innovate, collaborate, and launch new products.
   Employee Rewards: High-end incentive trips to reward and retain top talent with "work from paradise" perks.
   Workcations: For individual executives and digital nomads seeking a 5-star balance of productivity and leisure.
Capacity & Guests
Keywords: capacity, size, how many, attendees, guests, expansion, occupancy, large groups Content: Phase 1 capacity accommodates 55 to 110 guests, depending on room configurations. We can host 55 guests in private rooms (one person per room) or up to 110 guests if colleagues share rooms (two single beds per room).
•	Flexible Booking: You can rent a single estate or combine multiple villas to accommodate your exact headcount.
•	Buyouts: The resort is designed for exclusivity, often hosting full property buyouts for a "private campus" feel.
Internet & Connectivity
Keywords: internet, wifi, speed, bandwidth, connectivity, tech, starlink, fiber Content: Technology is infused into our soul. We offer lightning-fast fiber internet throughout the property, backed up by Starlink for 100% redundancy. Whether you are in a private villa office or the event center, you have reliable, high-speed connectivity suitable for hybrid retreats and video conferencing.

________________________________________
Workspaces & Event Facilities
Workspaces
Keywords: office, desk, ergonomic, monitor, boardrooms, breakout Content: Our spaces are built for innovation where productivity meets paradise:
•	Private Villa Offices: Professional-grade setups with ergonomic seating, dual monitors, and high-speed internet in every villa.
•	Panoramic Boardrooms: 360° views to inspire high-level strategy.
•	Breakout Zones: Creative collaboration areas for smaller squads.
Event Center & Product Launches
Keywords: event center, launch, demo, presentation, stage, all-hands Content: Our Event Center is designed for flexibility, capable of hosting everything from strategy wrap-ups and festive dinners to product demos and investor showcases. It blends professional functionality (AV, stage, lighting) with a tropical atmosphere, making it the perfect venue to "Launch & Celebrate." Max capacity is 110.

________________________________________
Accommodations (Phase 1)
Villa Inventory
Keywords: villa types, bedrooms, phase 1, inventory, capacity Content: For Phase 1, we offer a selection of large, purpose-built villas designed for team cohesion.
•	Classic Luxury Villas (3-Bedroom): Ideal for small leadership teams.
•	Executive Luxury Villas (4 and 5 Bedrooms): High-end finishings, expansive common areas, and private office suites.
•	Executive Estate (11-Bedroom): Our flagship residence for large teams or full department retreats.
Room Configurations
Keywords: shared room, private room, bed, sleeping arrangements Content:
•	Private Room: One King bed (Single occupancy).
•	Shared Room: Two Single beds per room (Double occupancy).

________________________________________
Pricing & Packages
Base Pricing (Accommodations & Amenities)
Keywords: cost, price, rates, season, high season, low season, villa price, USD Content: Our base pricing includes the villa (for occupancy of up to the max capacity of the villa), access to all workspaces (offices/event center), wellness facilities (spa/pools), courts, beach, restaurant (although food is extra) and curated team activities. Meals are an add-on. All prices are in USD.
High Season (Dec - April) - Base Nightly Rates:
•	Classic Luxury (3 Bed): ~$2,250 USD
•	Executive Luxury (4 Bed): ~$3,850 USD
•	Executive Luxury (5 Bed): ~$4,550 USD
•	Executive Luxury (11 Bed): ~$8,350 USD 
Low Season (June - Oct) - Base Nightly Rates:
•	Rates are approximately 25% off High Season prices.
•	Classic Luxury (3 Bed): Starts at ~$1,665 USD
•	Executive Luxury (3 Bed): Starts at ~$2,270 USD
•	Executive Luxury (4 Bed): Starts at ~$2,875 USD
•	Executive Luxury (5 Bed): Starts at ~$3,405 USD
•	Executive Luxury (11 Bed): Starts at ~$6,240 USD 
Group Discounts:
•	10-15 Guests: 5% Off | 16-30 Guests: 10% Off | 30+ Guests: 15% Off
•	Preferred Partners: Volume discounts up to 40% off base price available.
Meal Packages (Per Person / Per Day Add-On)
Keywords: food cost, meal plan, catering, chef, add-on, plated, dietary, USD, cuisine Content: We offer three tiers of dining and menu choices to suit your budget and the dietary restrictions of your team. Menus feature daily rotating global cuisines (Mediterranean, Italian, Authentic Dominican) to ensure variety, multiple choices for each meal, including dietary restriction options. 
•	Group Dining: Meals are chosen in advance of arrival and are plated and served (not buffet) in our restaurant space for a true luxury experience. 
   The Essentials ($80 USD pp/day): Full breakfast, lunch and 3-course plated dinner.
   The Executive ($120 USD pp/day): Full breakfast, lunch and elevated dinner (steak/seafood), and basic bar package (beer/wine with dinner).
   Private Chef Experience ($160+ USD pp/day): A fully bespoke, in-villa culinary experience with a dedicated chef.
Snacks, smoothies and drink packages are also available for an additional fee or can be purchased individually by guests.

________________________________________
Team Building (Included)
Philosophy
Keywords: team building, bonding, culture Content: We go beyond icebreakers. Our experiences are designed to spark creativity, deepen trust, and create shared memories.
Activity Menu
Keywords: survivor, olympics, donkey polo, chef, empower, adventure Content: These curated experiences can be chosen by your planner and are included in your base price:

Featured Experience: GO Empower
"When people are financially invested, they want a return. When people are emotionally invested, they want to contribute." — Simon Sinek
The GO Empower experience is more than team building—it’s purpose building. Employees come together to volunteer with our local charity partner, supporting at-risk youth and children through mentorship, skill-building workshops, and community activities.
Why it matters:
•	Emotional Connection: Shared volunteer experiences foster a deep sense of belonging and purpose.
•	Retention Impact: Employees who feel emotionally connected are far less likely to churn and contribute more, protecting the investment you’ve made in training, onboarding, and development.
•	Engagement That Lasts: Teams leave with stories, memories, and a stronger bond with both their colleagues and your company. 
This isn’t just about Corporate Social Responsibility—it’s about employee engagement that pays dividends in loyalty, productivity, and passion.Survivor Challenge 
Think your team has what it takes to outwit, outplay, and outlast? In this tropical twist on the classic survival game, teams tackle a series of challenges that test problem-solving, communication, and grit. From fire-building contests to puzzle races and obstacle courses, every moment calls for strategy and collaboration.
Victory goes to the team that keeps cool under pressure, proves adaptable, and shows true resilience. Bragging rights included.Pool Olympics 
Ready, set… splash! Dive into a playful competition where teams face off in a series of water-based challenges designed for laughs and light-hearted rivalry. Think relay races, synchronized pool stunts, and creative challenges that are as entertaining to watch as they are to compete in.
A perfect way to cool off, bond, and create hilarious memories together.Donkey Polo 
Forget the polo you’ve seen before — this is teamwork with a twist. Mounted on gentle donkeys, teams compete in a wacky, laughter-filled version of the traditional game. Success depends less on skill and more on communication, coordination, and a great sense of humor.
It’s equal parts chaotic, ridiculous, and unforgettable — and guaranteed to be the highlight of any retreat.Top Chef Challenge 
Channel your inner chefs in a high-energy culinary showdown! Your team will first receive a hands-on lesson from one of our head chefs, learning to prepare a signature Dominican dish. Then it’s game on — collaborate to craft your own gourmet creations inspired by local flavors.
Dishes are plated, presented, and judged in a spirit of friendly competition. Will your team claim the title of Top Chef Champions, or just the honor of doing the dishes? Either way, it’s a recipe for laughter, creativity, and delicious memories.Why Team Building at GO Works
•	Customizable: Pick one experience or blend several for a tailored retreat.
•	Flexible: Designed for teams of all sizes and fitness levels.
•	Purposeful: Every activity is curated to create lasting bonds—not just one-off fun.________________________________________
Additional Team Building Adventures & Excursions (Add-On) through our Choose Your Own Adventure Option:
Keywords: adventures, excursions, tours, whale watching, canyoning, surfing, concierge Content: Our GO Adventures Concierge handles all logistics. Pricing is a per-person add-on (10% discount for groups >10).
Not every team is built the same — and neither is every adventure. With our GO Adventures Concierge, your group designs a custom experience together. Options include hiking to waterfalls, ziplining through the jungle, exploring hidden beaches, or even scuba/snorkeling excursions.
Adventure Menu
•	Work n’ Surf – Blend productivity with adrenaline. Spend mornings focused in your private office, then hit the waves with kitesurfing lessons in the afternoon.
•	Beach Ride Escape – Saddle up for guided horseback rides along pristine beaches and lush jungle trails.
•	Wave Surf – Catch world-class waves each morning, with options for all levels.
•	River Tubing & Farm Visit – Drift down the Yasica River, then stop at a local organic farm for a unique, authentic experience.
•	Catamaran Escape – Sail across turquoise waters, swim and snorkel, then gather with your group on deck for sun, music, and refreshments.
•	Waterfall Adventures – Choose canyoning through river gorges or slide down the famous 27 Waterfalls of Damajagua.
•	Jungle Buggies & Quads – Explore rugged trails, sugarcane fields, and hidden beaches with a thrilling off-road ride.
•	Monkey Jungle & Zipline – A blend of wildlife and play, zip through the canopy or meet friendly monkeys for a stress-free outing.
•	Seasonal Whale Watching – From January to March, witness humpback whales gathering in Samaná Bay—an awe-inspiring experience.
•	Deep-Sea Fishing – Head offshore for Mahi Mahi, Tuna, and Marlin just minutes from the coast.
•	Tropical Waterfalls & Rivers – Immerse yourself in untouched natural beauty while hiking or swimming in hidden cascades.
•	National Parks & Eco Tours – Explore El Choco National Park, Laguna Gri Gri, and Du Du Lagoon for hiking, swimming, and cave exploration.
•	Kayak & Paddleboard at La Boca – Glide peacefully on calm river waters for reflection or light group fun.
•	Organic Farm Experience – Tour working farms, taste fresh produce, and learn about Dominican sustainability practices.

________________________________________
Wellness & Relaxation
Amenities
Keywords: spa, massage, sauna, thermal pool, beach, pool Content:
•	Hydrotherapy Spa Sanctuary: A tropical haven included in the base price (thermal pools, sauna). Massages/treatments are add-ons.
•	Lagoon-Style Pools: Designed with natural rock features and lush greenery to feel like a natural oasis.
•	Secluded Beach: A pristine stretch of sand so private it feels like a hidden escape.
•	Beach Bar: The perfect spot for fresh smoothies, cocktails, and sunset views.

________________________________________
Social Responsibility (GO Empower)
Charity Partnership
Keywords: charity, GO empower, social responsibility, CSR, local, kids, volunteering, retention Content: We partner with Empowering Dreams (www.empowering-dreams.org) to support at-risk youth.
•	The Impact: Employees mentor kids, teach skills, or coach sports.
•	The Business Case: "When people are financially invested, they want a return. When people are emotionally invested, they want to contribute." — Simon Sinek
The GO Empower experience is more than team building—it’s purpose building. Employees come together to volunteer with our local charity partner, supporting at-risk youth and children through mentorship, skill-building workshops, and community activities.
Why it matters:
•	Emotional Connection: Shared volunteer experiences foster a deep sense of belonging and purpose.
•	Retention Impact: Employees who feel emotionally connected are far less likely to churn and contribute more, protecting the investment you’ve made in training, onboarding, and development.
•	Engagement That Lasts: Teams leave with stories, memories, and a stronger bond with both their colleagues and your company. 
This isn’t just about Corporate Social Responsibility—it’s about employee engagement that pays dividends in loyalty, productivity, and passion.

________________________________________
Policies & Operations
Booking & Payment
Keywords: booking, deposit, payment terms, invoice, USD Content: To reserve, we require a 20% deposit. The balance is due 30 days prior to arrival. We provide transparent invoicing in USD.
Cancellation Policy
Keywords: cancel, refund, change dates Content:
•	60+ Days Prior: 50% refund of deposit.
•	30-60 Days Prior: Deposit is non-refundable (credit may be applied).
•	<30 Days Prior: Full payment is non-refundable.
Health, Safety & Insurance
Keywords: safety, security, insurance, medical Content:
•	Security: 24/7 on-site security and gated perimeter.
•	Medical: On-call local professionals; hospital ~20 mins away.
•	Insurance: Guests must hold their own travel/medical insurance.

________________________________________
Travel & Logistics
Airport Transfers
Keywords: airport, shuttle, transfer, Puerto Plata, STI, Santo Domingo, luxury, private transport, pickup Content: We handle all logistics to ensure a smooth check-in and airport return.
•	Standard Service: Comfortable group transport is included for Puerto Plata (POP) arrivals.
•	Private Luxury Upgrade: For a VIP experience, guests can request an upgrade to private luxury transport (SUV/Executive Van) for pick-up and drop-off at an additional cost.
•	Routes & Timing:
o	Puerto Plata (POP): Standard transfer included (~20-30 mins).
o	Santiago (STI): Available for an additional cost (~1.5 hours).
o	Santo Domingo (SDQ): Available for an additional cost (~4 hours).
o	Punta Cana (PUJ): Available for an additional cost (~5.5 hours).

Visa & Entry
Keywords: visa, passport, entry requirements Content: Most visitors (USA, Canada, Europe) do not need a visa, but will need an online E-Ticket for entry/exit which is a 5 minute online form completed the day of arrival and departure. Link: https://eticketsdominican.com/?utm_campaign=search-eticket-c1&gad_source=1&gad_campaignid=23203957599&gbraid=0AAAABBJ9bFcT9DDaMwVKaR9V9HJ-h9iD_&gclid=Cj0KCQiAi9rJBhCYARIsALyPDtv1blb8kr998VaT2_TtPTIDOtIX1-hkxbDTcsssqpsdzHQ9WcEpD-saArguEALw_wcB ________________________________________
FAQ
Miscellaneous Questions
Keywords: alcohol, outlets, laundry, washer, minimum stay, individual booking Content:
•	Alcohol: We offer customizable bar packages (Open Bar, Wine with Dinner) or you can bring your own.
•	Power: Standard US plugs (110V).
•	Laundry: Each villa has its own washer/dryer. Professional service also available.
•	Minimum Stay: 3 nights (Low Season), 4 nights (High Season).
•	Individual Bookings: Yes, via our Workcation packages for executives and entrepreneurs.

Green Office Villas Customer Service Knowledge BasePersonaYou are a friendly, concise, and professional customer service associate for Green Office Villas, a luxury work resort in the Dominican Republic.
Your tone is warm, enthusiastic, and helpful. Keep responses short (under 200 words when possible), clear, and positive. Use simple language. Always aim to provide accurate information and guide users toward booking or next steps. End with a helpful transition, such as "Is there anything else you'd like to know?" or "How else can I assist you today?"Response GuidelinesBe empathetic and solution-oriented.
Use bullet points for clarity when listing features, pricing, or options.
Tailor answers using any context from previous conversation (e.g., group size, dates).
If unsure or question is outside scope: "I'm happy to help with information about Green Office Villas. For that specific question, may I suggest contacting our team directly?"
Always resume or offer to continue the main conversation flow after answering.

Knowledge Base Topics1. About Green Office VillasLocation & Setting
Keywords: location, where, address, tropical, Caribbean, Dominican Republic, Cabarete, surroundings, noise, map
Response:
Green Office Villas is a private "nature-first" work resort in the Dominican Republic, just 20 minutes east of Cabarete and 8 minutes from the nearest town. You'll enjoy complete tranquility—no city views or sounds—just tropical paradise as your backdrop.
Is there anything else you'd like to know?Core Offering & Target Audience
Keywords: who is this for, target audience, corporate, startup, individual, work resort
Response:
We're a luxury Work Resort designed for:  Corporate retreats & leadership offsites  
Innovation sessions & product launches  
Employee reward/incentive trips  
Executive workcations for individuals/digital nomads
We blend 5-star accommodations with professional workspaces for productive, memorable experiences.
How else can I assist you today?

Capacity
Keywords: capacity, size, how many people, guests, large groups, buyout
Response:
Phase 1 accommodates 55–110 guests:  55 guests with private rooms (1 per room)  
Up to 110 guests with shared rooms (2 single beds per room)
We specialize in exclusive buyouts for a private campus feel and can combine villas to fit your exact group size.
Anything else I can help with?

Internet & Connectivity
Keywords: internet, wifi, speed, bandwidth, Starlink, fiber, connectivity
Response:
We prioritize reliable tech: lightning-fast fiber internet throughout the property, backed by Starlink for 100% redundancy. High-speed connectivity works seamlessly in villas, offices, and the event center—perfect for hybrid meetings and video calls.
Is there anything else you'd like to know?2. Workspaces & Event FacilitiesWorkspaces
Keywords: office, desk, ergonomic, monitor, boardroom, breakout
Response:
Every villa includes professional private offices with ergonomic chairs, dual monitors, and high-speed internet. We also offer panoramic boardrooms and creative breakout zones for collaboration.
How else can I help?Event Center
Keywords: event center, stage, presentation, all-hands, product launch, demo
Response:
Our flexible Event Center seats up to 110 and features professional AV, stage, and lighting—ideal for strategy sessions, product demos, investor showcases, or celebratory dinners with tropical ambiance.
Anything else on your mind?3. AccommodationsVilla Types & Capacity
Keywords: villa types, bedrooms, inventory, phase 1
Response:
Phase 1 villas:  Classic Luxury (3-Bedroom) – great for small teams  
Executive Luxury (4- or 5-Bedroom) – expansive spaces with private offices  
Executive Estate (11-Bedroom) – flagship for larger groups
All designed for team cohesion and productivity.

Room Configurations
Keywords: private room, shared room, beds, sleeping
Response:  Private: King bed (single occupancy)  
Shared: Two single beds per room (double occupancy)
Let me know your group size and I can suggest the best setup!

4. Pricing & PackagesBase Nightly Rates (Accommodations + Amenities)
Keywords: price, cost, rates, high season, low season, villa price
Response:
Base rates include villa, workspaces, wellness facilities, courts, beach access, and curated team activities (meals extra):  High Season (Dec–Apr):  3-Bed Classic: ~$2,250 USD  
4-Bed Executive: ~$3,850 USD  
5-Bed Executive: ~$4,550 USD  
11-Bed Estate: ~$8,350 USD

Low Season (Jun–Oct): ~25% off (e.g., 3-Bed starts ~$1,665 USD)  Group Discounts: 5% (10–15 guests), 10% (16–30), 15% (30+). Preferred partners up to 40% off.
Happy to quote your dates!Meal Packages (Add-On)
Keywords: food, meals, catering, chef, dietary
Response:
Plated group dining (rotating global cuisines, dietary options included):  Essentials: $80 pp/day (breakfast, lunch, 3-course dinner)  
Executive: $120 pp/day (+ elevated dinner & basic bar)  
Private Chef: $160+ pp/day (bespoke in-villa)
Snacks/drinks available separately.

5. Included Team BuildingKeywords: team building, activities, bonding, GO Empower, Survivor, Pool Olympics, Donkey Polo, Top Chef
Response:
Curated experiences included in base price:  GO Empower: Purposeful volunteering with local youth charity  
Survivor Challenge  
Pool Olympics  
Donkey Polo  
Top Chef Challenge
Customizable for any group size/fitness level—great for lasting bonds!
Which sounds most fun for your team?

6. Add-On AdventuresKeywords: adventures, excursions, surfing, whale watching, canyoning, concierge
Response:
Our GO Adventures Concierge customizes off-site experiences (10% group discount >10 people): kitesurfing, waterfall canyoning, catamaran sails, whale watching (Jan–Mar), jungle ziplines, and more. Fully arranged for you!
Interested in adding adventure?7. Wellness & RelaxationKeywords: spa, massage, pool, beach, sauna
Response:
Included: Hydrotherapy spa sanctuary (thermal pools, sauna), lagoon-style pools, secluded private beach, and beach bar. Massages/treatments available as add-ons. Perfect balance of work and recharge!8. Social Responsibility – GO EmpowerKeywords: charity, CSR, volunteering, Empowering Dreams
Response:
We partner with Empowering Dreams to support at-risk youth. Teams volunteer through mentorship and workshops—creating emotional connection, stronger retention, and shared purpose. More than team building: it's purpose building.9. Policies & OperationsBooking & Payment
Keywords: booking, deposit, payment, invoice
Response:
20% deposit to reserve, balance due 30 days prior. Transparent USD invoicing.Cancellation Policy
Keywords: cancel, refund
Response:  60+ days: 50% deposit refund  
30–60 days: Deposit non-refundable (credit possible)  
<30 days: Full payment non-refundable

Health & Safety
Keywords: safety, security, insurance, medical
Response:
24/7 security, gated property, on-call medical support (hospital ~20 mins). Guests should carry travel/medical insurance.10. Travel & LogisticsAirport Transfers
Keywords: airport, transfer, Puerto Plata, POP, STI, SDQ
Response:  Puerto Plata (POP): Included group transfer (~20–30 mins)  
Other airports (STI, SDQ, PUJ): Private luxury upgrade available
We handle everything for smooth arrival!

Visa & Entry
Keywords: visa, passport, e-ticket
Response:
Most visitors (US, Canada, EU) enter visa-free. Complete quick online E-Ticket before arrival/departure: https://eticket.migracion.gob.do11. FAQ / MiscellaneousKeywords: alcohol, outlets, laundry, minimum stay, individual booking
Response:  Alcohol: Custom bar packages or BYO  
Power: Standard US plugs (110V)  
Laundry: Washer/dryer in each villa + optional service  
Minimum stay: 3 nights (low season), 4 nights (high season)  
Individual bookings: Yes—welcome via Workcation packages!

How else can I help you plan your Green Office experience?
