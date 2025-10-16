// Core chatbot logic rebuilt to match CHATBOT_FLOW_DOCUMENTATION.md
import { Question, InputType } from '@/types';

// Complete question flow implementation based on documentation
export const QUESTIONS: Record<string, Question> = {
  Q1: {
    id: 'Q1',
    text: "What best describes your role?",
    type: 'multiple_choice',
    options: [
      "Retreat Facilitator. Our clients engage me (or my company) to help facilitate retreats in some manner (ie. as a planner, consultant or to use our platform)",
      "Team Member/Leader. Our team is looking at options for an upcoming team retreat (ie. as a team leader or member)"
    ],
    next: (answer: number) => {
      if (answer === 0) return 'Q2';
      if (answer === 1) return 'Q3';
      return 'Q1';
    }
  },

  // Branch A: Planner Path (Q1 → Q2)
  Q2: {
    id: 'Q2',
    text: "We may be a neat fit! Green Office is purpose-built to help retreat facilitators (planners/platforms/consultants) offer deeply differentiated retreat experiences to your clients. What are you focused on at the moment?",
    type: 'multiple_choice',
    options: [
      "Exploring potential venues for our platform or portfolio",
      "I am planning a specific upcoming retreat for a client — curious if Green Office is a fit for it"
    ],
    next: (answer: number) => {
      if (answer === 0) return 'Q2_2_1';
      if (answer === 1) return 'Q2_1';
      return 'Q2';
    }
  },

  Q2_1: {
    id: 'Q2_1',
    text: "Sounds good, let's dig into your upcoming retreat to see if it is a fit",
    type: 'multiple_choice',
    options: ["Assess fit"],
    next: () => 'Q3'
  },

  Q2_2_1: {
    id: 'Q2_2_1',
    text: "I sense a fit. Green Office is designed to help differentiate your platform versus the competition. We may want to consider escalating your interest to a meeting with our leadership team to explore partnership models. How many retreats are organized by your company or through your platform per year?",
    type: 'multiple_choice',
    options: [
      "Fewer than 10",
      "10 to 100",
      "100 to 1,000",
      "1,000+"
    ],
    next: () => 'Q2_2_2'
  },

  Q2_2_2: {
    id: 'Q2_2_2',
    text: "What best describes the scale of average retreat organized by your company or through your platform?",
    type: 'multiple_choice',
    options: [
      "Consistently small (less than 20 per retreat on average) with little variation in size",
      "Variably small (less than 20 per retreat on average) with lots of variation in size",
      "Consistently moderate (20-50 per retreat on average) with little variation in size",
      "Variably moderate (20-50 per retreat on average) with lots of variation in size",
      "Consistently large (over 50 per retreat on average) with little variation in size",
      "Variably large (over 50 per retreat on average) with lots of variation in size"
    ],
    next: (answer: number) => {
      if (answer >= 0 && answer <= 3) return 'Q2_2_3';
      if (answer === 4) return 'PLANNER_LEAD_CAPTURE';
      if (answer === 5) return 'Q2_2_3';
      return 'Q2_2_2';
    },
    responseMessage: (answer: number) => {
      if (answer >= 0 && answer <= 3) {
        return "Green Office is purpose-built for retreats of that size.";
      }
      if (answer === 4) {
        return "We are expanding capacity to serve companies of your scale in 2027-2028; I can keep you updated if you provide me your email";
      }
      if (answer === 5) {
        return "We are expanding capacity to serve companies of your scale in 2027-2028; However, since you said your retreat size is wide-ranging, I'll bet we can accommodate some of the smaller retreats. Our current capacity is 50 attendees though we are planning to expand to 300+ in 2027-2028";
      }
      return "";
    }
  },

  Q2_2_3: {
    id: 'Q2_2_3',
    text: "What is your involvement in organizing the retreats initiated on your platform?",
    type: 'multiple_choice',
    options: [
      "Negligible, we are purely a platform used by 3rd party planners and corporate clients to identify potential retreat venues",
      "Limited, most of our clients manage the retreat themselves (via a retreat planner or themselves) though some engage us on aspects of the retreat planning",
      "Moderate, we manage a mix of retreat planning services depending on the client",
      "Active, most of our clients use us to fully manage the retreat end to end"
    ],
    next: () => 'PLANNER_PROSPECT_CAPTURE'
  },

  // Branch B: Actual Retreat Path, Determining Fit (Q1 → Q3)
  Q3: {
    id: 'Q3',
    text: "Got it. I have three critical questions to see if Green Office is a possible fit. Don't worry about perfect accuracy just yet - let's see if we are in the zone. Roughly, how many attendees do you expect?",
    type: 'number',
    validation: { min: 0, required: true },
    next: (answer: number) => {
      if (answer >= 2 && answer <= 50) return 'Q4';
      if (answer === 1) return 'ACTUAL_RETREAT_LEAD_CAPTURE';
      if (answer > 50) return 'ACTUAL_RETREAT_LEAD_CAPTURE';
      if (answer === 0) return 'ACTUAL_RETREAT_LEAD_CAPTURE';
      return 'Q3';
    },
    responseMessage: (answer: number) => {
      if (answer >= 2 && answer <= 50) {
        return "Excellent. Green Office is purpose-built for retreats of that size.";
      }
      if (answer === 1) {
        return "Sounds like quite the introverted retreat! We do have some individual bookings though retreats are what we are built for.";
      }
      if (answer > 50) {
        return "We are expanding capacity to serve companies of your scale in 2027-2028; Our current capacity is 50 attendees. Unless you can break up the retreat into sub groups, we might be too small to properly accommodate your team.";
      }
      if (answer === 0) {
        return "Maybe you aren't ready to commit to a retreat just yet. Could make sense to get your contact info so we can follow up with you later.";
      }
      return "I do not understand that response. Please enter a number.";
    }
  },

  Q4: {
    id: 'Q4',
    text: "On approximately which date do you aim to start the retreat?",
    type: 'date',
    validation: { required: true },
    next: (answer: string) => {
      const inputDate = new Date(answer);
      const cutoffDate = new Date('2026-11-01');
      if (inputDate < cutoffDate) return 'ACTUAL_RETREAT_LEAD_CAPTURE';
      return 'Q5';
    },
    responseMessage: (answer: string) => {
      const inputDate = new Date(answer);
      const cutoffDate = new Date('2026-11-01');
      if (inputDate < cutoffDate) {
        return "Unfortunately, Green Office won't be open quite yet on that day. But do not lose heart! We are aiming to open in December of 2026";
      }
      return "";
    }
  },

  Q5: {
    id: 'Q5',
    text: "Approximately how many days long do you expect the retreat to run?",
    type: 'number',
    validation: { min: 1, required: true },
    next: (answer: number) => {
      if (answer >= 3 && answer <= 120) return 'Q6';
      return 'ACTUAL_RETREAT_PROSPECT_CAPTURE';
    },
    responseMessage: (answer: number) => {
      if (answer >= 3 && answer <= 120) {
        return "Green Office is purpose-built for your team size, we are operational on your start date and the retreat duration fits perfectly";
      }
      return "Unfortunately, Green Office may not be a good fit for that retreat duration. Probably we should connect to clarify as the duration is a bit unusual for a retreat";
    }
  },

  Q6: {
    id: 'Q6',
    text: "Since Green Office seems to fit your team, we could wrap up this chat with next steps or, if you prefer, I have a longer list of detailed retreat planning questions. If you have the time, the detailed retreat questions will allow our team to better prepare for our follow up meeting and should make that meeting sail by faster. The questions may also help you think through the retreat planning details. Let me know which you prefer?",
    type: 'multiple_choice',
    options: [
      "Let's wrap up this chat with next steps (1-2 minutes)",
      "Let's get into the detailed retreat planning questions (4-5 minutes)"
    ],
    next: (answer: number) => {
      if (answer === 0) return 'ACTUAL_RETREAT_PROSPECT_CAPTURE';
      if (answer === 1) return 'Q7';
      return 'Q6';
    }
  },

  Q7: {
    id: 'Q7',
    text: "Let's get into it - I have 18 questions for you which should take 4 - 5 minutes. What are Primary retreat goals? (you may select more than 1)",
    type: 'multiple_choice_multi_select',
    options: [
      "Team-building",
      "Work-output", 
      "Relaxation-celebration"
    ],
    next: (answer: number[]) => {
      // This will be handled by conditional logic in the chatbot class
      return 'Q8_Q9_Q10_CONDITIONAL';
    }
  },

  Q8: {
    id: 'Q8',
    text: "Which team-building activities resonate?",
    type: 'multiple_choice_multi_select',
    options: [
      "Thermal Spa",
      "Challenge Games",
      "Horseback Riding",
      "Kitesurfing",
      "Team Games"
    ],
    next: (answer: number[]) => 'Q8_COMPLETE'
  },

  Q9: {
    id: 'Q9',
    text: "What sort of work output do you hope to achieve?",
    type: 'multiple_choice_multi_select',
    options: [
      "Strategic Planning",
      "Build a Product",
      "Maintain Normal Work Output while at the Retreat"
    ],
    next: (answer: number[]) => 'Q9_COMPLETE'
  },

  Q10: {
    id: 'Q10',
    text: "What relaxation-celebration activities resonate?",
    type: 'multiple_choice_multi_select',
    options: [
      "Thermal Spa",
      "Running/Walking along the beach",
      "Horseback Riding along the beach",
      "Kitesurfing",
      "Pool/Swimming",
      "Networking/Socializing",
      "Stargazing",
      "Sun Tanning"
    ],
    next: (answer: number[]) => 'Q10_COMPLETE'
  },

  Q11: {
    id: 'Q11',
    text: "Transportation needs?",
    type: 'multiple_choice_multi_select',
    options: [
      "Prefer Green Office manages some/all transportation to/from the Airport",
      "Prefer to manage some/all transportation to/from the Airport ourselves (eg. car rental, taxi, etc)"
    ],
    next: (answer: number[]) => 'Q12'
  },

  Q12: {
    id: 'Q12',
    text: "Accommodation preferences?",
    type: 'multiple_choice_multi_select',
    options: [
      "Attendees may share rooms (separate beds) - lowest cost option",
      "Attendees may share villas (separate rooms)",
      "Attendees each have a private villa (maximum privacy)"
    ],
    next: (answer: number[]) => 'Q13'
  },

  Q13: {
    id: 'Q13',
    text: "Any pets or visitors (eg. family)?",
    type: 'multiple_choice_multi_select',
    options: [
      "Pets",
      "Family (not participating in the retreat)"
    ],
    next: (answer: number[]) => 'Q14'
  },

  Q14: {
    id: 'Q14',
    text: "Meal preferences?",
    type: 'multiple_choice_multi_select',
    options: [
      "Eat at Green Office Restaurants (GO-restaurant)",
      "Eat in your Villa with Green Office supplying the food and cooking per your schedule (GO-cook)",
      "Eat in your villa with Green Office supplying the food and you cooking the food (self-cook)",
      "Eat in your villa with you supplying your own food and cooking (self-all)"
    ],
    next: (answer: number[]) => 'Q15'
  },

  Q15: {
    id: 'Q15',
    text: "Select which workspace requirements you have for the retreat?",
    type: 'multiple_choice_multi_select',
    options: [
      "Reliable, high-speed internet",
      "High quality office space (ergonomic chair/desk, plug-in ready docking station, dual monitor, keyboard, mouse, etc)",
      "Plug-in ready Projectors/whiteboard team working spaces",
      "360 degree ocean view board-room for larger group meetings"
    ],
    next: (answer: number[]) => 'Q16'
  },

  Q16: {
    id: 'Q16',
    text: "How many employees in your company?",
    type: 'multiple_choice',
    options: [
      "<50 employees",
      "50-500",
      ">500",
      "Unsure"
    ],
    next: (answer: number) => 'Q17'
  },

  Q17: {
    id: 'Q17',
    text: "What industry is your company in?",
    type: 'text',
    next: (answer: string) => 'Q18'
  },

  Q18: {
    id: 'Q18',
    text: "What is a line or two description of the role the team (attending the retreat) plays at the company?",
    type: 'text',
    next: (answer: string) => 'Q19'
  },

  Q19: {
    id: 'Q19',
    text: "What is your team's current hybrid work model? Please include details such as quarterly work-from-office weeks, days-per-week in office, etc",
    type: 'text',
    next: (answer: string) => 'Q20'
  },

  Q20: {
    id: 'Q20',
    text: "Where do you typically hold your team retreats?",
    type: 'multiple_choice',
    options: [
      "Company Office",
      "Urban environment (Away from the office)",
      "Natural environment (Away from the office)",
      "Other"
    ],
    next: (answer: number) => 'Q21'
  },

  Q21: {
    id: 'Q21',
    text: "Describe the different types of retreats/team events you hold and how frequently you hold them",
    type: 'text',
    next: (answer: string) => 'Q22'
  },

  Q22: {
    id: 'Q22',
    text: "Your role on the team (or in the company)?",
    type: 'multiple_choice',
    options: [
      "Retreat Consultant/Planner",
      "Team Leader",
      "Team Assistant",
      "Senior Executive",
      "Other"
    ],
    next: (answer: number) => 'Q23'
  },

  Q23: {
    id: 'Q23',
    text: "How did you first learn about Green Office?",
    type: 'multiple_choice',
    options: [
      "LinkedIn",
      "Online Search",
      "Word of Mouth / Referral",
      "Conference",
      "Other"
    ],
    next: (answer: number) => 'Q24'
  },

  Q24: {
    id: 'Q24',
    text: "By what date do you need to firm up your retreat decision?",
    type: 'date',
    next: (answer: string) => 'Q25'
  },

  Q25: {
    id: 'Q25',
    text: "Would you like us to first contact you prior to offering the space to a client lower in the queue?",
    type: 'yes_no',
    next: (answer: number) => 'ACTUAL_RETREAT_PROSPECT_CAPTURE' // Answer is 0 for "Yes", 1 for "No"
  },

  // Lead Capture Flows
  PLANNER_LEAD_CAPTURE: {
    id: 'PLANNER_LEAD_CAPTURE',
    text: "Hope this interaction was helpful. I'll update our team with a summary of our chat. Let's consider some options for staying in touch.",
    type: 'multiple_choice',
    options: ["Options for staying in touch"],
    next: () => 'GREEN_OFFICE_UPDATE_OPTIONS'
  },

  PLANNER_PROSPECT_CAPTURE: {
    id: 'PLANNER_PROSPECT_CAPTURE',
    text: "Based on our chat, I suspect your organization and Green Office make a good fit. I suggest we organize a 20 minute introductory call with our team - does that work?",
    type: 'yes_no',
    next: (answer: number) => {
      // For yes/no questions, answer is 0 for "Yes" and 1 for "No"
      if (answer === 0) return 'ACQUIRE_NAME'; // Yes - proceed to contact acquisition
      return 'GREEN_OFFICE_UPDATE_OPTIONS'; // No - show update options
    }
  },

  ACTUAL_RETREAT_LEAD_CAPTURE: {
    id: 'ACTUAL_RETREAT_LEAD_CAPTURE',
    text: "Hope this interaction was helpful. I'll update our team with a summary of our chat. While now may not be a perfect fit, let's consider some options for staying in touch.",
    type: 'multiple_choice',
    options: ["Options for staying in touch"],
    next: () => 'GREEN_OFFICE_UPDATE_OPTIONS'
  },

  ACTUAL_RETREAT_PROSPECT_CAPTURE: {
    id: 'ACTUAL_RETREAT_PROSPECT_CAPTURE',
    text: "Based on our chat, I suspect your organization and Green Office should be a good fit. I suggest we organize a 20 minute introductory call with our team to dig further into your retreat details - does that work?",
    type: 'yes_no',
    next: (answer: number) => {
      // For yes/no questions, answer is 0 for "Yes" and 1 for "No"
      if (answer === 0) return 'ACQUIRE_NAME'; // Yes - proceed to contact acquisition
      return 'GREEN_OFFICE_UPDATE_OPTIONS'; // No - show update options
    }
  },

  // Green Office Update Options Flow
  GREEN_OFFICE_UPDATE_OPTIONS: {
    id: 'GREEN_OFFICE_UPDATE_OPTIONS',
    text: "How do you prefer to stay updated?",
    type: 'multiple_choice',
    options: [
      "Put me in the waitlist queue (first come, first serve)",
      "Contact me by email after a set number of months",
      "Contact me by phone after a set number of months",
      "Keep me informed of Green Office project updates",
      "I do not see a fit at this time nor at any time in the future"
    ],
    next: (answer: number) => {
      if (answer === 0) return 'ACQUIRE_NAME';
      if (answer === 1) return 'UPDATE_OPTIONS_MONTHS_EMAIL';
      if (answer === 2) return 'UPDATE_OPTIONS_MONTHS_PHONE';
      if (answer === 3) return 'ACQUIRE_NAME';
      if (answer === 4) return 'END_NO_FIT';
      return 'GREEN_OFFICE_UPDATE_OPTIONS';
    }
  },

  UPDATE_OPTIONS_MONTHS_EMAIL: {
    id: 'UPDATE_OPTIONS_MONTHS_EMAIL',
    text: "How many months from now would you like us to contact you?",
    type: 'number',
    validation: { min: 1, required: true },
    next: () => 'ACQUIRE_NAME'
  },

  UPDATE_OPTIONS_MONTHS_PHONE: {
    id: 'UPDATE_OPTIONS_MONTHS_PHONE',
    text: "How many months from now would you like us to contact you?",
    type: 'number',
    validation: { min: 1, required: true },
    next: () => 'ACQUIRE_NAME'
  },

  END_NO_FIT: {
    id: 'END_NO_FIT',
    text: "All good, you know where to find us if you see a change in fit potential!",
    type: 'multiple_choice',
    options: ["End conversation"],
    next: () => 'END'
  },

  // Acquire Contact Information Flow
  ACQUIRE_NAME: {
    id: 'ACQUIRE_NAME',
    text: "What is your name?",
    type: 'text',
    validation: { required: true },
    next: () => 'ACQUIRE_COMPANY' // Will be handled with correction logic
  },

  ACQUIRE_COMPANY: {
    id: 'ACQUIRE_COMPANY',
    text: "What company are you with?",
    type: 'text',
    validation: { required: true },
    next: () => 'ACQUIRE_EMAIL' // Will be handled with correction logic
  },

  ACQUIRE_EMAIL: {
    id: 'ACQUIRE_EMAIL',
    text: "What is your email address?",
    type: 'text',
    inputType: InputType.EMAIL,
    validation: { required: true },
    next: () => 'ACQUIRE_PHONE' // Will be handled with correction logic
  },

  ACQUIRE_PHONE: {
    id: 'ACQUIRE_PHONE',
    text: "What is your phone number?",
    type: 'text',
    validation: { required: true },
    next: () => 'CONTACT_CONFIRMATION' // Will be handled with correction logic
  },

  CONTACT_CONFIRMATION: {
    id: 'CONTACT_CONFIRMATION',
    text: "", // Will be dynamically generated
    type: 'yes_no',
    next: (answer: number) => {
      // For yes/no questions, answer is 0 for "Yes" and 1 for "No"
      // Note: When answer is 0 (Yes), routing is handled in processResponse() based on needsScheduling flag
      if (answer === 0) return 'END'; // Yes - will be overridden in processResponse()
      return 'CONTACT_CORRECTION'; // No - needs correction
    }
  },

  CONTACT_CORRECTION: {
    id: 'CONTACT_CORRECTION',
    text: "What would you like to correct? (Please type: name, company, email, or phone)",
    type: 'text',
    next: () => 'ACQUIRE_NAME' // Will be handled with logic
  },

  // Schedule Call Flow
  SCHEDULE_CALL_PROPOSE: {
    id: 'SCHEDULE_CALL_PROPOSE',
    text: "When would work best for a 20-minute introductory call?",
    type: 'multiple_choice',
    options: [
      "Tomorrow at 2:00 PM",
      "Friday at 10:00 AM",
      "Next Monday at 3:00 PM",
      "Propose a different date and time"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'SCHEDULE_CALL_CUSTOM';
      return 'SCHEDULE_CALL_CONFIRM';
    }
  },

  SCHEDULE_CALL_CUSTOM: {
    id: 'SCHEDULE_CALL_CUSTOM',
    text: "Please propose a date and time that works for you",
    type: 'text',
    validation: { required: true },
    next: () => 'SCHEDULE_CALL_CONFIRM'
  },

  SCHEDULE_CALL_CONFIRM: {
    id: 'SCHEDULE_CALL_CONFIRM',
    text: "", // Will be dynamically generated
    type: 'yes_no',
    next: (answer: number) => {
      // For yes/no questions, answer is 0 for "Yes" and 1 for "No"
      if (answer === 0) return 'SCHEDULE_CALL_CONFIRMED'; // Yes - confirm the scheduled time
      return 'SCHEDULE_CALL_PROPOSE'; // No - propose different times
    }
  },

  SCHEDULE_CALL_CONFIRMED: {
    id: 'SCHEDULE_CALL_CONFIRMED',
    text: "We are set. Email sent to you and admin@greenofficevillas.com with the meeting details.  Feel free to respond to admin@greenofficevillas.com if you have any questions or plans change. We look forward to speaking with you!",
    type: 'multiple_choice',
    options: ["End conversation"],
    next: () => 'END'
  }
};

export class SimpleChatbot {
  private currentQuestion: string = 'Q1';
  private userResponses: Record<string, any> = {};
  private conditionalQuestions: string[] = [];

  // Contact information tracking
  private contactInfo: {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
  } = {};

  // Flow state tracking
  private updateOption?: number;
  private updateMonths?: number;
  private scheduledTime?: string;
  private needsScheduling: boolean = false;

  // Contact correction tracking
  private fieldsToCorrect: Set<string> = new Set();
  private isInCorrectionFlow: boolean = false;

  constructor() {
    this.reset();
  }

  reset() {
    this.currentQuestion = 'Q1';
    this.userResponses = {};
    this.conditionalQuestions = [];
    this.contactInfo = {};
    this.updateOption = undefined;
    this.updateMonths = undefined;
    this.scheduledTime = undefined;
    this.needsScheduling = false;
    this.fieldsToCorrect = new Set();
    this.isInCorrectionFlow = false;
  }

  getCurrentQuestion(): Question | null {
    const question = QUESTIONS[this.currentQuestion];
    if (!question) return null;

    // Generate dynamic text for certain questions
    if (question.id === 'CONTACT_CONFIRMATION') {
      return {
        ...question,
        text: `Please confirm your contact information:\n\n  👤 ${this.contactInfo.name}\n  🏢 ${this.contactInfo.company}\n  📧 ${this.contactInfo.email}\n  📱 ${this.contactInfo.phone}\n\nIs this correct?`
      };
    }

    if (question.id === 'SCHEDULE_CALL_CONFIRM') {
      const time = this.scheduledTime || "the proposed time";
      return {
        ...question,
        text: `Just to confirm, you'd like to schedule the call for ${time}. Is that correct?`
      };
    }

    return question;
  }

  processResponse(answer: any): { nextQuestion: string; response?: string } {
    const question = this.getCurrentQuestion();
    if (!question) return { nextQuestion: 'Q1' };

    // Store the response
    this.userResponses[question.id] = answer;

    // Track contact information
    if (question.id === 'ACQUIRE_NAME') this.contactInfo.name = answer;
    if (question.id === 'ACQUIRE_COMPANY') this.contactInfo.company = answer;
    if (question.id === 'ACQUIRE_EMAIL') this.contactInfo.email = answer;
    if (question.id === 'ACQUIRE_PHONE') this.contactInfo.phone = answer;

    // Handle correction flow navigation
    if (this.isInCorrectionFlow && (question.id === 'ACQUIRE_NAME' || question.id === 'ACQUIRE_COMPANY' || question.id === 'ACQUIRE_EMAIL' || question.id === 'ACQUIRE_PHONE')) {
      // Remove the current field from correction list since it's been corrected
      const currentField = question.id.replace('ACQUIRE_', '').toLowerCase();
      this.fieldsToCorrect.delete(currentField);

      // Find the next field that needs correction
      if (this.fieldsToCorrect.has('name')) {
        this.currentQuestion = 'ACQUIRE_NAME';
        return { nextQuestion: 'ACQUIRE_NAME' };
      }
      if (this.fieldsToCorrect.has('company')) {
        this.currentQuestion = 'ACQUIRE_COMPANY';
        return { nextQuestion: 'ACQUIRE_COMPANY' };
      }
      if (this.fieldsToCorrect.has('email')) {
        this.currentQuestion = 'ACQUIRE_EMAIL';
        return { nextQuestion: 'ACQUIRE_EMAIL' };
      }
      if (this.fieldsToCorrect.has('phone')) {
        this.currentQuestion = 'ACQUIRE_PHONE';
        return { nextQuestion: 'ACQUIRE_PHONE' };
      }

      // All corrections completed, exit correction mode and go to confirmation
      this.isInCorrectionFlow = false;
      this.fieldsToCorrect.clear();
      this.currentQuestion = 'CONTACT_CONFIRMATION';
      return { nextQuestion: 'CONTACT_CONFIRMATION' };
    }

    // Track update options
    if (question.id === 'GREEN_OFFICE_UPDATE_OPTIONS') {
      this.updateOption = answer;
    }
    if (question.id === 'UPDATE_OPTIONS_MONTHS_EMAIL' || question.id === 'UPDATE_OPTIONS_MONTHS_PHONE') {
      this.updateMonths = answer;
    }

    // Track scheduling
    if (question.id === 'PLANNER_PROSPECT_CAPTURE' || question.id === 'ACTUAL_RETREAT_PROSPECT_CAPTURE') {
      // For yes/no questions, answer is 0 for "Yes" and 1 for "No"
      this.needsScheduling = answer === 0; // Yes - user wants to schedule a call
    }
    if (question.id === 'SCHEDULE_CALL_PROPOSE' && answer !== 3) {
      const options = question.options || [];
      this.scheduledTime = options[answer];
    }
    if (question.id === 'SCHEDULE_CALL_CUSTOM') {
      this.scheduledTime = answer;
    }

    // Handle contact correction
    if (question.id === 'CONTACT_CORRECTION') {
      const correction = answer.toLowerCase().trim();

      // Clear previous correction tracking and set correction mode
      this.fieldsToCorrect.clear();
      this.isInCorrectionFlow = true;

      // Parse which fields need correction
      if (correction.includes('name')) {
        this.fieldsToCorrect.add('name');
      }
      if (correction.includes('company')) {
        this.fieldsToCorrect.add('company');
      }
      if (correction.includes('email')) {
        this.fieldsToCorrect.add('email');
      }
      if (correction.includes('phone')) {
        this.fieldsToCorrect.add('phone');
      }

      // If no specific field mentioned, default to name
      if (this.fieldsToCorrect.size === 0) {
        this.fieldsToCorrect.add('name');
      }

      // Start with the first field that needs correction
      if (this.fieldsToCorrect.has('name')) {
        this.currentQuestion = 'ACQUIRE_NAME';
        return { nextQuestion: 'ACQUIRE_NAME' };
      }
      if (this.fieldsToCorrect.has('company')) {
        this.currentQuestion = 'ACQUIRE_COMPANY';
        return { nextQuestion: 'ACQUIRE_COMPANY' };
      }
      if (this.fieldsToCorrect.has('email')) {
        this.currentQuestion = 'ACQUIRE_EMAIL';
        return { nextQuestion: 'ACQUIRE_EMAIL' };
      }
      if (this.fieldsToCorrect.has('phone')) {
        this.currentQuestion = 'ACQUIRE_PHONE';
        return { nextQuestion: 'ACQUIRE_PHONE' };
      }

      // Fallback (should not reach here)
      this.currentQuestion = 'ACQUIRE_NAME';
      return { nextQuestion: 'ACQUIRE_NAME' };
    }

    // Handle contact confirmation - skip CONTACT_CONFIRMED and route directly with thank you message
    if (question.id === 'CONTACT_CONFIRMATION') {
      // For yes/no questions, answer is 0 for "Yes" and 1 for "No"
      if (answer === 0) {
        // User confirmed contact info is correct
        // Generate thank you message based on update option
        let thankYouMessage = "Contact information successfully confirmed.";
        if (this.updateOption === 0) {
          thankYouMessage += "Green Office will contact you when bookings are available and you are at the front of the waitlist.";
        } else if (this.updateOption === 1) {
          thankYouMessage += `Green Office will contact you in ${this.updateMonths} months by email.`;
        } else if (this.updateOption === 2) {
          thankYouMessage += `Green Office will contact you in ${this.updateMonths} months by phone.`;
        } else if (this.updateOption === 3) {
          thankYouMessage += "Green Office will keep you updated on our project.";
        }

        // Route based on scheduling needs
        if (this.needsScheduling) {
          this.currentQuestion = 'SCHEDULE_CALL_PROPOSE';
          return { nextQuestion: 'SCHEDULE_CALL_PROPOSE', response: thankYouMessage };
        } else {
          this.currentQuestion = 'END';
          return { nextQuestion: 'END', response: thankYouMessage };
        }
      }
      // If answer is 1 (No), the next() function will handle routing to CONTACT_CORRECTION
    }

    // Log meeting when confirmed
    if (question.id === 'SCHEDULE_CALL_CONFIRMED') {
      console.log('Meeting scheduled:', {
        userEmail: this.contactInfo.email,
        userName: this.contactInfo.name,
        userCompany: this.contactInfo.company,
        userPhone: this.contactInfo.phone,
        dateTime: this.scheduledTime,
        adminEmail: 'admin@greenofficevillas.com'
      });
    }

    // Handle special conditional logic for Q7
    if (question.id === 'Q7') {
      this.conditionalQuestions = [];

      let selectedIndices: number[] = [];
      if (Array.isArray(answer)) {
        selectedIndices = answer;
      } else if (typeof answer === 'string') {
        selectedIndices = answer.split(',').map(Number).filter(n => !isNaN(n));
      } else if (typeof answer === 'number') {
        selectedIndices = [answer];
      }

      if (selectedIndices.includes(0)) this.conditionalQuestions.push('Q8');
      if (selectedIndices.includes(1)) this.conditionalQuestions.push('Q9');
      if (selectedIndices.includes(2)) this.conditionalQuestions.push('Q10');

      if (this.conditionalQuestions.length > 0) {
        this.currentQuestion = this.conditionalQuestions[0];
        return { nextQuestion: this.conditionalQuestions[0] };
      } else {
        this.currentQuestion = 'Q11';
        return { nextQuestion: 'Q11' };
      }
    }

    // Handle conditional question completion
    if (['Q8_COMPLETE', 'Q9_COMPLETE', 'Q10_COMPLETE'].includes(question.next(answer))) {
      const currentIndex = this.conditionalQuestions.indexOf(question.id);
      if (currentIndex !== -1) {
        this.conditionalQuestions.splice(currentIndex, 1);
      }

      if (this.conditionalQuestions.length > 0) {
        this.currentQuestion = this.conditionalQuestions[0];
        return { nextQuestion: this.conditionalQuestions[0] };
      } else {
        this.currentQuestion = 'Q11';
        return { nextQuestion: 'Q11' };
      }
    }

    // Get next question and optional response message
    const nextQuestionId = question.next(answer);
    let responseMessage: string | undefined;

    // Check if question has a response message function
    if (question.responseMessage) {
      const msg = question.responseMessage(answer);
      if (msg) {
        responseMessage = msg;
      }
    }

    // Handle conversation end
    if (nextQuestionId === 'END') {
      return { nextQuestion: 'END', response: responseMessage };
    }

    this.currentQuestion = nextQuestionId;
    return { nextQuestion: nextQuestionId, response: responseMessage };
  }

  getUserResponses(): Record<string, any> {
    return { ...this.userResponses };
  }

  calculateQualificationScore(): number {
    let score = 0;

    // Role and basic qualification (20 points)
    if (this.userResponses.Q1 === 0 || this.userResponses.Q1 === 1) score += 20;

    // Group size (20 points)
    if (this.userResponses.Q3) {
      const attendees = this.userResponses.Q3;
      if (attendees >= 10 && attendees <= 50) score += 20;
      else if (attendees >= 5 && attendees <= 100) score += 15;
      else if (attendees >= 1) score += 10;
    }

    // Date validation (15 points)
    if (this.userResponses.Q4) {
      const inputDate = new Date(this.userResponses.Q4);
      const cutoffDate = new Date('2026-11-01');
      if (inputDate >= cutoffDate) score += 15;
    }

    // Duration validation (15 points)
    if (this.userResponses.Q5) {
      const duration = this.userResponses.Q5;
      if (duration >= 3 && duration <= 120) score += 15;
    }

    // Detailed questions completion (30 points)
    if (this.userResponses.Q7) score += 30;

    return Math.min(score, 100);
  }

  getInitialGreeting(): string {
    return "Welcome! I have some questions to explore whether Green Office is a fit for you. You may pause my questioning by asking your own question (by clicking the last option presented on each question)";
  }
}
