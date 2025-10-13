# Chatbot Flow Documentation - Bot-Driven Conversation

## Overview

This document details the complete conversation flow when the chatbot is "driving" the interaction. The flow consists of around 25 questions organized in a decision-tree structure designed to qualify leads and gather comprehensive retreat requirements.

### Chat Interface
The chatbot uses a **single chat window design** with the following features:

1. **In-Chat Interactive Buttons**: All multiple choice questions appear as clickable buttons within bot messages
2. **Selected Option Highlighting**: When a user clicks an option, it appears as a green highlighted user message
3. **Persistent Custom Question Input**: Always-available input field at the bottom for custom questions
4. **Smooth Animations**: All interactions include smooth transitions and visual feedback
5. **Form Link**: Below the single chat window, a link to another page which says "I prefer to learn more about Green Office from a human".  The page is a form that asks for their first (required) and last (required) name, their email (required), their phone number (optional), Retreats per year (Integer, optional) and Attendees per retreat (Integer, optional).

### Hybrid Response Handling

**Important:** Users can interact with the chatbot in two ways at any point in the conversation:

1. **Clickable Options**: Click on provided multiple choice buttons to follow the guided conversation flow
2. **Custom Questions**: Type any question in the persistent input field at the bottom

**How Hybrid Responses Work:**
- When a user asks a custom question, the bot responds with context awareness of the entire conversation history
- After answering the custom question, the bot continues by re-presenting the current question's clickable options
- The conversation flow position is maintained - custom questions don't advance or interrupt the guided flow
- Users can seamlessly switch between clicking options and asking custom questions

## Initial Greeting

**Bot Message:**
"Welcome! I'll ask a series of questions to help you explore whether Green Office is a fit.  At any time, you may pause this series of questions by asking any question on your mind (entering it at the bottom of this chat window)"

## Question Flow Structure

### Q1: Role Identification (Entry Point)
**Question:** "What best describes your role?"

**Options:**
- Option 1: Our clients engage me (or my company) to help facilitate retreats in some manner (e.g., planner/platform/consultants) → **Go to Q2**
- Option 2: We are looking at options for an upcoming team retreat (eg. I am a team leader, team assistant, etc) → **Go to Q3**

**Note:** Users can ask custom questions anytime using the persistent input field at the bottom of the chat, or click one of the provided options to continue the guided flow.

---

## Branch A: Planner Path (Q1 → Q2)

### Q2: Planner Interest Type
**Question:** "We may be a great fit! Green Office is purpose-built to help retreat planners/platforms/consultants offer deeply differentiated retreat experiences to your clients. What are you focused on at the moment?"

**Options:**
- Option 1: I am planning an upcoming retreat for a client — curious if Green Office is a fit → **Go to Q2.1**
- Option 2: Exploring potential venues for our platform or portfolio → **Go to Q2.2.1**

### Q2.1: Client Retreat Planning
**Question:** "Perfect, let's sketch out the retreat plan"
**Path:** Skip to Q3 and follow the flow from there

### Q2.2.1: Venue Scouting
**Question:** "Interesting, Green Office might help differentiate your platform verus the competition.  I feel we may want to escalate your interest to a meeting with our leadership team to explore partnership models.  How many retreats are organized by your company or through your platform per year?"

**Options:**
- Option 1: Fewer than 10 **Go to Q2.2.2**
- Option 2: 10 to 100 **Go to Q2.2.2**
- Option 3: 100 to 1,000 **Go to Q2.2.2**
- Option 4: 1,000+ **Go to Q2.2.2**

### Q2.2.2: Typical Retreat Size
**Question:** "What best describes the scale of average retreat organized by your company or through your platform?"

**Options:**
- Option 1: Consistently small (less than 20 per retreat on average) with little variation
- Option 2: Small (less than 20 per retreat on average) but ranges widely
- Option 3: Consistently moderate (20-50 per retreat on average) with little variation
- Option 4: Moderate (20-50 per retreat on average) but ranges widely
- Option 5: Consistently large (over 50 per retreat on average) with little variation
- Option 6: Large (over 50 per retreat on average) but ranges widely

**Validation & Responses:**
- Option 1-4: "Green Office is purpose-built for retreats of that scale." → **Continue to Q2.2.3**
- Option 5: "We are expanding capacity to serve companies of your scale in 2027-2028; I can keep you updated if you provide me your email" → **Planner Lead Capture**
- Option 6: "We are expanding capacity to serve companies of your scale in 2027-2028;  However, since you said your retreat size is wide-ranging, I'll bet we can accomodate some of the smaller retreats.  Our current capacity is 50 attenddees though we are planning to expand to 300+ in 2027-2028" → **Continue to Q2.2.3**

### Q2.2.3: The Platform's Retreat Planning Role
**Question:** "What is your involvement in organizing the retreats initiated on your platform?"
**Options:**
- Option 1: Negligible, we are purely a platform used by 3rd party planners and corporate clients to identify potential retreat venues **Go to Planner Prospect Capture**
- Option 2: Limited, most of our clients manage the retreat themselves (via a retreat planner or themselves) though some engage us on aspects of the the retreat planning **Go to Planner Prospect Capture**
- Option 3: Moderate, we manage a mix of retreat planning services depending on the client **Go to Planner Prospect Capture**
- Option 4: Active, most of our clients use us to fully manage the retreat end to end **Go to Planner Prospect Capture**

**Planner Lead Capture**
"Hope this interaction was helpful.  I'll update our team with the summary" -> Jump to **Green Office Update Options**

**Planner Prospect Capture**
"Hope this interaction was helpful.  Based on our chat, I expect your organization and Green Office should be a good fit.  I suggest we organize a 20m introductory call with our team - does that work?
If **Yes** -> Jump to **Acquire Contact Information** followed by **Schedule Call with Green Office**
If **No** -> Jump to **Green Office Update Options** followed by **Acquire Contact Information**

**Acquire Contact Information**
Ask for their name, company, email and phone.  Chat back and forth until information is acquired.  Present it back for user confirmation.  Once confirmed, move on either to schedule call or end the conversation.

**Schedule Call with Green Office**
Propose a few dates.  Chat back and forth until a good time is confirmed.  Present it back to the user for confirmation.  Once confirmed, send them and admin@greenofficevillas.com an outlook meeting invite and close the conversation. 

**Green Office Update Options**
"How do you prefer to stay updated?"
**Options:**
-Option 1: Put me in the waitlist queue (first come, first serve)
-Option 2: contact me by email after a set number of months (ask user for how many months if this option is selected)
-Option 3: contact me by phone after a set number of months (ask user for how many months if this option is selected)
-Option 4: Keep me informed of Green Office project updates
-Option 5: I do not see a fit at this time nor at any time in the future

**Validation & Responses:**
- Option 1-4: Goto the **Acquire Contact Information** step and in the final confirmation be clear about how the interaction will occur:
ie. Option 1: Green Office will contact you when we bookings are available and you are at the front of the waitlist
ie. Option 2: Green Office will contact you in [user selected] months by email
ie. Option 3: Green Office will contact you in [user selected] months by phone 
ie. Option 4: Green Office will keep you up to date with project updates

---

## Branch B: Actual Retreat Path, Determining Fit (Q1 → Q3)

**Actual Retreat Lead Capture**
"I'll update our team with the summary of our chat.  The fit today may not be perfect, but I suspect we'll want to stay in touch." -> Jump to **Green Office Update Options**

**Actual Retreat Prospect Capture**
"Based on our chat, I expect your organization and Green Office should be a good fit.  I suggest we organize a 20m introductory call with our team to get further into your retreat details - does that work?
If **Yes** -> Jump to **Acquire Contact Information** followed by **Schedule Call with Green Office**
If **No** -> Jump to **Green Office Update Options** followed by **Acquire Contact Information**

### Q3: Team Size Validation
**Question:** "Great, I have three critical questions to see if Green Office is a possible fit based on the number (estimated or actual) of retreat attendees, the (approximate or actual) retreat date and its estimated duration.  Don't worry about perfect detail accuracy quite yet - let's see if we are in the approximate zone.  How many attendees do you expect?"
**Input Type:** Integer

**Validation & Responses:**
- Attendees between 2 and 50: "Perfect.  Green Office is purpose-built for retreats of that size." → **Continue to Q4**
- Attendees = 1: "Sounds like quite the introverted retreat!  We do have some individual bookings though retreats are what we are built for." → **Actual Retreat Lead Capture**
- Attendees > 50: "We are expanding capacity to serve companies of your scale in 2027-2028;  Our current capacity is 50 attenddees.  Unless you can break up the retreat into sub groups, we might be too small to properly accomodate your team." → **Actual Retreat Lead Capture**
- Attendees = 0: "Maybe you aren't ready to commit to a retreat just yet.  Could make sense to get your contact info so we can follow up with you later." → **Actual Retreat Lead Capture**
- Attendees = any other entry: "I do not understand that response.  Please enter a number." → **Repeat Q3**

### Q4: Date Validation
**Question:** "What approximate date do you aim to start the retreat on?"
**Input Type:** Date

**Validation & Responses:**
- Starting prior to Nov 1, 2026: "Unfortunately, Green Office won't be open quite yet on that day.  But do not lose heart!  We are aiming to open in December of 2026" → **Actual Retreat Lead Capture**
- Starting on or after Nov 1, 2026:  → **Continue to Q5**

### Q5: Retreat Duration
**Question:** "Approximately, how many days long do you expect the retreat to run?"
**Input Type:** Integer

**Validation & Responses:**
- Any entry between 3 and 120 (inclusive) then respond "Green Office is purpose-built for your team size, we are operational on your start date and the retreat duration fits perfectly" → **Continue to Q6**
- Any other value: (ask for clarification if response is not an integer or seems like an error) "Unfortunately, Green Office may not be a good fit for that retreat duration.  Probably we should connect to clarify as the duration is a bit unusual for a retreat" → **Actual Retreat Prospect Capture**

---

## Actual Retreat Path, Details (Q6 - Q25)

### Q6: Retreat Goals
**Question:** "Since Green Office is a good fit for your team, we could wrap up this chat with next steps or, if you prefer, I have a longer list of detailed retreat planning questions.  If you have the time, the detailed retreat questions will allow our team to better prepare for our follow up meeting and should make that meeting sail by faster.  The questions may also help you think through the retreat planning details.  Let me know which you prefer?"
**Options:**
- Option 1: Let's wrap up this chat with next steps (1-2 minutes) → **Actual Retreat Prospect Capture**
- Option 2: Let's get into the detailed retreat planning questions (4-5 minutes)  → **Go to Q7**

### Q7: Retreat Goals
**Question:** "Great!  Let's get into it - I have 18 questions for you which should take 4 - 5 minutes.  What are Primary retreat goals? (you may select more than 1)"

**Options:** (multi-select with a confirm button)
- Option 1: Team-building → **Include Q8**
- Option 2: Work-output → **Include Q9**
- Option 3: Relaxation-celebration → **Include Q10**
- Confirm Button: (Saves the selected retreat goals)

### Q8: Team-Building Activities (if Option 1 was among the selected retreat goals in Q7)
**Question:** "Which team-building activities resonate?"

**Options:** (multi-select with a confirm button)
- Option 1: Thermal Spa
- Option 2: Challenge Games
- Option 3: Horseback Riding
- Option 4: Kitesurfing
- Option 5: Team Games
- Confirm Button: (Saves the selected)

### Q9: Work-output Requirements (if Option 2 was among the selected retreat goals in Q7)
**Question:** "What sort of work output do you hope to achieve?"

**Options:** (multi-select with a confirm button)
- Option 1: Strategic Planning
- Option 2: Build a Product
- Option 3: Maintain Normal Work Output while at the Retreat
- Confirm Button: (Saves the selected)

### Q10: Relaxation-celebration Requirements (if Option 3 was among the selected retreat goals in Q7)
**Question:** "What relaxation-celebration activities resonate?"

**Options:** (multi-select with a confirm button)
- Option 1: Thermal Spa
- Option 2: Running/Walking along the beach
- Option 3: Horseback Riding along the beach
- Option 4: Kitesurfing
- Option 5: Pool/Swimming
- Option 6: Networking/Socializing
- Option 7: Stargazing
- Option 8: Sun Tanning
- Confirm Button: (Saves the selected)

**Flow Continuation:** After completing any applicable conditional questions (Q8, Q9, Q10), continue to Q11.

### Q11: Transportation Preference
**Question:** "Transportation needs?"

**Options:** (multi-select with a confirm button)
- Option 1: Would prefer Green Office manages all transportation to/from the Airport
- Option 2: Would prefer to manage all transportation to/from the Airport ourselves (eg. car rental, taxi, etc)
- Confirm Button: (Saves the selected)

→ **Continue to Q12**

### Q12: Accommodation
**Question:** "Accommodation preferences?"

**Options:** (multi-select with a confirm button)
- Option 1: Attendees may share rooms (separate beds) - lowest cost option
- Option 2: Attendees may share villas (separate rooms)
- Option 3: Attendees each have a private villas (maximum privacy)
- Confirm Button: (Saves the selected)

→ **Continue to Q13**

### Q13: Pets/Family
**Question:** "Any pets or family inclusions?"

**Options:** (multi-select with a confirm button)
- Option 1: Pets
- Option 2: Family (not participating in the retreat)
- Confirm Button: (Saves the selected)

→ **Continue to Q14**

### Q14: Meals
**Question:** "Meal preferences?"

**Options:** (multi-select with a confirm button)
- Option 1: Eat at Green Office Restaurants (GO-restaurant)
- Option 2: Eat in your Villa with Green Office supplying the food and cooking per your schedule (GO-cook)
- Option 3: Eat in your villa with Green Office supplying the food and you cooking the food (self-cook)
- Option 4: Eat in your villa with you supplying your own food and cooking (self-all)
- Confirm Button: (Saves the selected)

→ **Continue to Q15**

### Q15: Workspace Requirements
**Question:** "Select which workspace requirements you have for the retreat?"

**Options:** (multi-select with a confirm button)
- Option 1: Reliable, high-speed internet
- Option 2: High quality office space (ergonomic chair/desk, plug-in ready docking station, dual monitor, keyboard, mouse, etc)
- Option 3: Plug-in ready Projectors/whiteboard team working spaces
- Option 4: 360 degree ocean view board-room for larger group meetings
- Confirm Button: (Saves the selected)

→ **Continue to Q16**

### Q16: Company Size
**Question:** "What is your company's Overall size?"

**Options:**
- Option 1: <50 employees
- Option 2: 50-500
- Option 3: >500
- Option 4: Unsure

→ **Continue to Q17**

### Q17: Industry
**Question:** "What industry is your company in?"
**Input Type:** Open text

→ **Continue to Q18**

### Q18: Team
**Question:** "What is a line or two description of the role the team (attending the retreat) plays in the company?"
**Input Type:** Open text

→ **Continue to Q19**

### Q19: Hybrid
**Question:** "What is your team's current hybrid work model?  Please include details such as quarterly work-from-office weeks, days-per-week in office, etc"
**Input Type:** Open text

→ **Continue to Q20**

### Q20: Retreat History
**Question:** "Where do you typically hold your team retreats?"

**Options:**
- Option 1: Company Office
- Option 2: Urban environment (Away from the office)
- Option 3: Natural environment (Away from the office)
- Option 4: Other

→ **Continue to Q21**

### Q21: Additional Retreat Details
**Question:** "Describe the different types of retreats/team events you hold and how frequently you hold them"
**Input Type:** Open text

→ **Continue to Q22**

### Q22: Role of Survey Taker
**Question:** "Your role on the team (or in the company)?"

**Options:**
- Option 1: Retreat Consultant/Planner
- Option 2: Team Leader
- Option 3: Team Assistant
- Option 4: Senior Executive
- Option 5: Other

→ **Continue to Q23**

### Q23: Discovery Source
**Question:** "How did you first learn about Green Office?"

**Options:**
- Option 1: LinkedIn
- Option 2: Online Search
- Option 3: Word of Mouth / Referral
- Option 4: Conference
- Option 5: Other

→ **Continue to Q24**

### Q24: Decision Timeline
**Question:** "By what date do you need to firm up your retreat decision?"
**Input Type:** Date

→ **Continue to Q25**

### Q25: First Call
**Question:** "Would you like us to first contact you prior to offering the space to a client lower in the queue?"
**Input Type:** Yes/No
After they answer Q25, go to **Actual Retreat Prospect Capture**

## Flow Convergence/Ending

**Final Message:**
All chat sessions should end in one of the four: (with the flow for each defined in the relevant section above)
**Planner Lead Capture**
**Planner Prospect Capture**
**Actual Retreat Lead Capture**
**Actual Retreat Prospect Capture**

## Flow Management Rules

### Custom Question Handling
- Users can ask custom questions anytime via the persistent input field at bottom
- Custom questions are handled via OpenAI integration with static knowledge base fallback
- After custom question response → Main conversation flow continues uninterrupted
- No need to switch modes - custom questions are seamlessly integrated

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