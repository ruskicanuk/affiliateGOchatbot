# Chatbot Flow Documentation - Bot-Driven Conversation

## Overview

This document details the complete conversation flow when the chatbot is "driving" the interaction. The flow consists of 35+ questions (Q1-Q35) organized in a decision-tree structure designed to qualify leads and gather comprehensive retreat requirements.

## POC Implementation Note

**For the initial 2-week POC, implement in phases:**
- **Week 1**: Q1-Q10 (core qualification questions)
- **Week 2**: Q11-Q35 (complete flow)

The full flow documentation below represents the complete vision, but can be implemented incrementally.

## Initial Greeting

**Bot Message:**
"Welcome! I'm here to help you explore Green Office Villas, a premium eco-friendly venue for productive team retreats featuring private villas with office spaces, high-speed internet, and amenities to strengthen team culture. Let's see if it's a fit—what best describes your role?"

## Primary Flow Structure

### Q1: Role Identification (Entry Point)
**Question:** "What best describes your role?"

**Options:**
- Option 1: My clients are companies that engage me (or my company) to help them organize retreats (e.g., retreat planner/agency) → **Go to Q2**
- Option 2: We are not retreat planners by profession but are in the midst of organizing a team retreat (e.g., internal team lead) → **Go to Q3**
- Option 3: Something else (please describe briefly) → **Go to Q12**
- Option 4: Let me ask a question → **Knowledge Base Mode**

---

## Branch A: Retreat Planner Path (Q1 → Q2)

### Q2: Planner Interest Type
**Question:** "We may be a great fit! Green Office Villas is built to help planners offer clients tailor-made retreats. What best describes your interest?"

**Options:**
- Option 1: I am planning a retreat for a client—curious if Green Office is a fit → **Go to Q2.1**
- Option 2: Scouting venues for our platform/portfolio → **Go to Q2.2**
- Option 3: Interested in partnerships (e.g., affiliates) → **Go to Q2.3**
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q2.1: Client Retreat Planning
**Question:** "Let's dive into your client's retreat. How many attendees?"
**Input Type:** Integer

**Validation & Responses:**
- Invalid input: "Oops, typo—how many attendees?"
- 1-50: "Perfect fit for our villas." → **Continue to Q4**
- 51-400: "Expanding by 2027-2028; email for updates?" → **Lead Capture**
- >400: "Too large; options for subgroups? Email?" → **Lead Capture**
- Alternate: Let me ask a question → **Knowledge Base Mode**

### Q2.2: Venue Scouting
**Question:** "What venue types are you prioritizing?"

**Options:**
- Option 1: Eco-friendly
- Option 2: Work-focused
- Option 3: Luxury tropical
- Option 4: All
- Option 5: Let me ask a question → **Knowledge Base Mode**

### Q2.2.1: Group Size for Scouting
**Question:** "We match that. Typical client group size? (e.g., 10-50)"
**Branch to:** Size handling like Q2.1

### Q2.3: Partnership Interest
**Question:** "What partnership type?"
**Input Type:** Open text
**Follow-up:** "Promising—email for discussion?" → **Lead Capture**

---

## Branch B: Internal Team Lead Path (Q1 → Q3)

### Q3: Team Size Validation
**Question:** "Let's check fit. How many attendees?"
**Input Type:** Integer
**Validation:** Same as Q2.1

---

## Main Qualification Flow (Q4-Q35)

### Q4: Retreat Goals
**Question:** "Primary retreat goals?"
**Applies to:** Q3/Q2.1 responses (1-50 attendees)

**Options:**
- Option 1: Team-building → **Go to Q5**
- Option 2: Work-focused → **Go to Q6**
- Option 3: Both → **Go to Q5 and Q6**
- Option 4: Relaxation → **Continue to Q7**
- Option 5: Let me ask a question → **Knowledge Base Mode**

### Q5: Team-Building Activities
**Question:** "Specific team-building activities?"
**Triggered by:** Q4 Options 1 or 3

**Options:**
- Option 1: Outdoor (hiking/games)
- Option 2: Creative (art/cooking)
- Option 3: Wellness (yoga)
- Option 4: Open to suggestions
- Option 5: Let me ask a question → **Knowledge Base Mode**

### Q6: Work Requirements
**Question:** "Key work needs?"
**Triggered by:** Q4 Options 2 or 3

**Options:**
- Option 1: Meeting rooms
- Option 2: Tech setup
- Option 3: Quiet spaces
- Option 4: All
- Option 5: Let me ask a question → **Knowledge Base Mode**

### Q7: Retreat Duration
**Question:** "Retreat duration? (Days, integer 1-30)"
**Input Type:** Integer (1-30)

**Validation & Responses:**
- Invalid: "Try again—how many days?"
- 1-3: "Short-stay packages."
- 4-7: "Full-week rentals."
- 8+: "Extended immersions."
- Alternate: Let me ask a question → **Knowledge Base Mode**

### Q8: Timeline
**Question:** "Planned dates/season? (e.g., MM/DD/YYYY or 'fall 2025')"
**Input Type:** Open text
**Response:** "Noted [echo]. Availability in [high-level]."

### Q9: Budget Range
**Question:** "Budget per person?"

**Options:**
- Option 1: <$500
- Option 2: $500-1000
- Option 3: $1000-2000
- Option 4: >$2000
- Option 5: Unsure
- Option 6: Let me ask a question → **Knowledge Base Mode**

### Q10: Special Requirements
**Question:** "Special requirements?"

**Options:**
- Option 1: Dietary
- Option 2: Accessibility
- Option 3: Sustainability
- Option 4: Tech
- Option 5: None
- Option 6: Let me ask a question → **Knowledge Base Mode**

### Q11: Discovery Source
**Question:** "How did you hear about us?"

**Options:**
- Option 1: Search
- Option 2: Referral
- Option 3: Social
- Option 4: Other
- Option 5: Let me ask a question → **Knowledge Base Mode**

### Q12: Other Role Handler
**Question:** "[Echo description]. Retreat-related?"
**Logic:** If yes → Go to Q3; else → provide help then resume

### Q13: Industry/Sector
**Question:** "Team's industry/sector? (e.g., tech, finance)"
**Input Type:** Open text
**Purpose:** Tailors suggestions

### Q14: Location Preferences
**Question:** "Location preferences? (e.g., tropical, urban)"
**Input Type:** Open text
**Response:** "We're in [tropical setting]; alternatives?"

### Q15: Transportation
**Question:** "Transportation needs? (e.g., airport shuttle)"

**Options:**
- Option 1: Yes, group transport
- Option 2: Individual
- Option 3: None
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q16: Accommodation
**Question:** "Accommodation preferences?"

**Options:**
- Option 1: Shared rooms
- Option 2: Single occupancy
- Option 3: Mix
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q17: Meals
**Question:** "Meal preferences? (e.g., catered, self)"

**Options:**
- Option 1: Full catering
- Option 2: Partial
- Option 3: Dietary specifics
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q18: Agenda Structure
**Question:** "Agenda structure? (e.g., structured days)"
**Input Type:** Open text
**Response:** "We support flexible schedules."

### Q19: Past Experience
**Question:** "Past retreat experiences? (Good/bad aspects)"
**Input Type:** Open text
**Purpose:** "Helps avoid pitfalls."

### Q20: Decision Timeline
**Question:** "Decision timeline? (e.g., weeks/months)"
**Input Type:** Open text
**Purpose:** "Urgency for booking?"

### Q21: Contact Preference
**Question:** "Preferred contact? (Email/phone)"

**Options:**
- Option 1: Email
- Option 2: Phone
- Option 3: Both
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q22: Company Size
**Question:** "Overall company size?"

**Options:**
- Option 1: <50 employees
- Option 2: 50-500
- Option 3: >500
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q23: Decision Role
**Question:** "Your decision-making role?"

**Options:**
- Option 1: Sole decider
- Option 2: Influencer
- Option 3: Researcher
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q24: Competition
**Question:** "Competitors considered?"
**Input Type:** Open text
**Follow-up:** "What stands out about them?"

### Q25: Customization
**Question:** "Customizations needed? (e.g., branding)"
**Input Type:** Open text
**Response:** "We offer personalization."

### Q26: Sustainability
**Question:** "Sustainability priorities? (e.g., carbon offset)"

**Options:**
- Option 1: High
- Option 2: Medium
- Option 3: Low
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q27: Tech Requirements
**Question:** "Detailed tech requirements? (e.g., bandwidth)"
**Input Type:** Open text
**Response:** "Our high-speed setup covers most."

### Q28: Team Demographics
**Question:** "Team demographics? (e.g., remote/hybrid)"

**Options:**
- Option 1: Fully remote
- Option 2: Hybrid
- Option 3: In-office
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q29: Budget Breakdown
**Question:** "Budget breakdown? (e.g., % for venue/food)"
**Input Type:** Open text
**Purpose:** "Helps optimize packages."

### Q30: Pets/Family
**Question:** "Any pets or family inclusions?"

**Options:**
- Option 1: Yes, pets
- Option 2: Yes, family
- Option 3: No
- Option 4: Let me ask a question → **Knowledge Base Mode**

### Q31: Virtual Elements
**Question:** "Virtual elements? (e.g., hybrid retreat)"

**Options:**
- Option 1: Yes
- Option 2: No
- Option 3: Let me ask a question → **Knowledge Base Mode**

### Q32: Insurance
**Question:** "Insurance/liability needs?"
**Input Type:** Open text
**Response:** "We provide standard coverage."

### Q33: Website Feedback
**Question:** "Feedback on our site? (If visited)"
**Input Type:** Open text
**Purpose:** "Improves our service."

### Q34: Referral Potential
**Question:** "Referral potential? (e.g., for future)"
**Input Type:** Open text
**Response:** "We have programs."

### Q35: Final Catch-All
**Question:** "Anything else to share?"
**Input Type:** Open text
**Purpose:** Final opportunity for additional information

## Flow Convergence/Ending

**Trigger:** After approximately 10-15 questions per path, or user fatigue indicators

**Final Message:**
"Thanks! Summary: [Echo key information gathered]. Great fit (or notes). Email for personalized details? Then to www.greenofficevillas.com!"

**Actions:**
1. Summarize collected information
2. Provide fit assessment
3. Request email for lead capture
4. Redirect to main website

## Flow Management Rules

### Interruption Handling
- At any "Let me ask a question" option → Switch to Knowledge Base Mode
- After knowledge base response → Resume with next relevant question
- Maintain flow state throughout interruptions

### Adaptive Flow
- Skip irrelevant questions based on previous answers
- Adjust question order based on user responses
- Terminate early if clear non-fit or user fatigue

### Validation Rules
- Integer inputs: Validate range and format
- Open text: Minimum character requirements
- Options: Ensure valid selection
- Provide helpful error messages for invalid inputs

This flow structure ensures comprehensive lead qualification while maintaining user engagement through the option to ask questions at any point.
