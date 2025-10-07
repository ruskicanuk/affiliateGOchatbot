// Core chatbot logic in single file for POC
import { Question } from '@/types';


// Week 1: Q1-Q10 implementation (core qualification questions)
export const QUESTIONS: Record<string, Question> = {
  Q1: {
    id: 'Q1',
    text: "What best describes your role?",
    type: 'multiple_choice',
    options: [
      "My clients are companies that engage me (or my company) to help them organize retreats (e.g., retreat planner/agency)",
      "We are not retreat planners by profession but are in the midst of organizing a team retreat (e.g., internal team lead)"
    ],
    next: (answer: number) => {
      if (answer === 0) return 'Q2';
      if (answer === 1) return 'Q3';
      return 'Q1';
    }
  },

  Q2: {
    id: 'Q2',
    text: "We may be a great fit! Green Office Villas is built to help planners offer clients tailor-made retreats. What best describes your interest?",
    type: 'multiple_choice',
    options: [
      "I am planning a retreat for a client—curious if Green Office is a fit",
      "Scouting venues for our platform/portfolio",
      "Interested in partnerships (e.g., affiliates)"
    ],
    next: (answer: number) => {
      if (answer === 0) return 'Q2_1';
      if (answer === 1) return 'Q2_2';
      if (answer === 2) return 'Q2_3';
      return 'Q2';
    }
  },

  Q2_1: {
    id: 'Q2_1',
    text: "Let's dive into your client's retreat. How many attendees?",
    type: 'number',
    next: (answer: number) => {
      if (answer >= 1 && answer <= 50) return 'Q4';
      if (answer >= 51 && answer <= 400) return 'LEAD_CAPTURE_WAITLIST';
      if (answer > 400) return 'LEAD_CAPTURE_TOO_LARGE';
      return 'Q2_1'; // Invalid input
    }
  },

  Q3: {
    id: 'Q3',
    text: "Let's check fit. How many attendees?",
    type: 'number',
    next: (answer: number) => {
      if (answer >= 1 && answer <= 50) return 'Q4';
      if (answer >= 51 && answer <= 400) return 'LEAD_CAPTURE_WAITLIST';
      if (answer > 400) return 'LEAD_CAPTURE_TOO_LARGE';
      return 'Q3'; // Invalid input
    }
  },

  Q4: {
    id: 'Q4',
    text: "Primary retreat goals?",
    type: 'multiple_choice',
    options: [
      "Team-building",
      "Work-focused",
      "Both",
      "Relaxation"
    ],
    next: (answer: number) => {
      if (answer === 0) return 'Q5';
      if (answer === 1) return 'Q6';
      if (answer === 2) return 'Q5'; // Both - start with team building
      if (answer === 3) return 'Q7';
      return 'Q4';
    }
  },

  Q5: {
    id: 'Q5',
    text: "What team-building activities interest you most?",
    type: 'multiple_choice',
    options: [
      "Outdoor adventures",
      "Creative workshops",
      "Cultural experiences",
      "Wellness activities"
    ],
    next: (answer: number) => {
      return 'Q8'; // Continue to timeline question
    }
  },

  Q6: {
    id: 'Q6',
    text: "What work-focused activities are priorities?",
    type: 'multiple_choice',
    options: [
      "Strategic planning sessions",
      "Skills training workshops",
      "Project collaboration",
      "Leadership development",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q8'; // Continue to timeline question
    }
  },

  Q7: {
    id: 'Q7',
    text: "What relaxation elements are most important?",
    type: 'multiple_choice',
    options: [
      "Spa and wellness",
      "Nature and outdoor spaces",
      "Flexible schedule",
      "Recreational activities",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q8'; // Continue to timeline question
    }
  },

  Q8: {
    id: 'Q8',
    text: "When are you looking to hold this retreat?",
    type: 'multiple_choice',
    options: [
      "Within 3 months",
      "3-6 months",
      "6-12 months",
      "More than 12 months",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q9';
    }
  },

  Q9: {
    id: 'Q9',
    text: "What's your approximate budget per person?",
    type: 'multiple_choice',
    options: [
      "Under $500",
      "$500-$1000",
      "$1000-$2000",
      "Over $2000",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q10';
    }
  },

  Q10: {
    id: 'Q10',
    text: "How important is sustainability/eco-friendliness for your retreat?",
    type: 'multiple_choice',
    options: [
      "Very important - it's a key requirement",
      "Somewhat important - nice to have",
      "Not a priority",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q11';
    }
  },

  Q11: {
    id: 'Q11',
    text: "What's your role in the decision-making process?",
    type: 'multiple_choice',
    options: [
      "I make the final decision",
      "I influence the decision",
      "I'm researching options for someone else",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q12';
    }
  },

  Q12: {
    id: 'Q12',
    text: "What's your company size?",
    type: 'multiple_choice',
    options: [
      "Under 50 employees",
      "50-500 employees",
      "Over 500 employees",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q13';
    }
  },

  Q13: {
    id: 'Q13',
    text: "How long would you like the retreat to be?",
    type: 'multiple_choice',
    options: [
      "1-2 days",
      "3-4 days",
      "5-7 days",
      "More than a week",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q14';
    }
  },

  Q14: {
    id: 'Q14',
    text: "What's most important for your team's work setup?",
    type: 'multiple_choice',
    options: [
      "High-speed internet and tech support",
      "Quiet, focused work environments",
      "Collaborative spaces for group work",
      "Flexible indoor/outdoor options",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q15';
    }
  },

  Q15: {
    id: 'Q15',
    text: "Does your team work remotely, in-office, or hybrid?",
    type: 'multiple_choice',
    options: [
      "Fully remote",
      "Hybrid (mix of remote and office)",
      "Primarily in-office",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q16';
    }
  },

  Q16: {
    id: 'Q16',
    text: "Any special dietary requirements or preferences?",
    type: 'multiple_choice',
    options: [
      "Vegetarian/Vegan options needed",
      "Gluten-free options needed",
      "No special requirements",
      "Multiple dietary needs",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q17';
    }
  },

  Q17: {
    id: 'Q17',
    text: "What industry is your company in?",
    type: 'text',
    next: (answer: string) => {
      return 'Q18';
    }
  },

  Q18: {
    id: 'Q18',
    text: "Have you organized team retreats before?",
    type: 'multiple_choice',
    options: [
      "Yes, multiple times",
      "Yes, once or twice",
      "No, this is our first",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q19';
    }
  },

  Q19: {
    id: 'Q19',
    text: "What's your preferred retreat location type?",
    type: 'multiple_choice',
    options: [
      "Tropical/beach setting",
      "Mountain/nature setting",
      "Urban/city setting",
      "No preference",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q20';
    }
  },

  Q20: {
    id: 'Q20',
    text: "How important is having recreational activities available?",
    type: 'multiple_choice',
    options: [
      "Very important - key for team bonding",
      "Somewhat important - nice to have",
      "Not important - focus on work",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q21';
    }
  },

  Q21: {
    id: 'Q21',
    text: "What's your team's age demographic?",
    type: 'multiple_choice',
    options: [
      "Mostly younger (20s-30s)",
      "Mixed ages",
      "Mostly experienced (40s+)",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q22';
    }
  },

  Q22: {
    id: 'Q22',
    text: "Do you need meeting rooms for presentations or workshops?",
    type: 'multiple_choice',
    options: [
      "Yes, essential for our agenda",
      "Yes, would be helpful",
      "No, informal spaces are fine",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q23';
    }
  },

  Q23: {
    id: 'Q23',
    text: "How flexible are your dates?",
    type: 'multiple_choice',
    options: [
      "Very flexible - can adjust as needed",
      "Somewhat flexible - prefer certain months",
      "Fixed dates - specific timeframe required",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q24';
    }
  },

  Q24: {
    id: 'Q24',
    text: "What's the primary outcome you want from this retreat?",
    type: 'multiple_choice',
    options: [
      "Improved team communication and collaboration",
      "Strategic planning and goal setting",
      "Team bonding and morale boost",
      "Skills development and training",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q25';
    }
  },

  Q25: {
    id: 'Q25',
    text: "How important is privacy for your group?",
    type: 'multiple_choice',
    options: [
      "Very important - need exclusive access",
      "Somewhat important - prefer minimal other groups",
      "Not important - comfortable sharing space",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q26';
    }
  },

  Q26: {
    id: 'Q26',
    text: "Do you need transportation assistance?",
    type: 'multiple_choice',
    options: [
      "Yes, airport transfers needed",
      "Yes, local transportation needed",
      "No, we'll handle our own transport",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q27';
    }
  },

  Q27: {
    id: 'Q27',
    text: "What's your experience level with international travel for business?",
    type: 'multiple_choice',
    options: [
      "Very experienced - travel internationally regularly",
      "Some experience - occasional international trips",
      "Limited experience - mostly domestic travel",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q28';
    }
  },

  Q28: {
    id: 'Q28',
    text: "How important is having 24/7 support during your stay?",
    type: 'multiple_choice',
    options: [
      "Very important - essential for peace of mind",
      "Somewhat important - good to have",
      "Not important - we're self-sufficient",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q29';
    }
  },

  Q29: {
    id: 'Q29',
    text: "Would you be interested in cultural experiences or local activities?",
    type: 'multiple_choice',
    options: [
      "Yes, very interested - important part of the experience",
      "Yes, somewhat interested - if time allows",
      "No, prefer to focus on work and team activities",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q30';
    }
  },

  Q30: {
    id: 'Q30',
    text: "What's your biggest concern about organizing this retreat?",
    type: 'multiple_choice',
    options: [
      "Budget and cost management",
      "Logistics and coordination",
      "Ensuring everyone enjoys it",
      "Balancing work and fun",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q31';
    }
  },

  Q31: {
    id: 'Q31',
    text: "How do you typically measure the success of team events?",
    type: 'multiple_choice',
    options: [
      "Team feedback and satisfaction surveys",
      "Improved collaboration after the event",
      "Achievement of specific goals/outcomes",
      "Overall participation and engagement",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q32';
    }
  },

  Q32: {
    id: 'Q32',
    text: "Would you like assistance with planning activities and agenda?",
    type: 'multiple_choice',
    options: [
      "Yes, full planning assistance needed",
      "Yes, some guidance would be helpful",
      "No, we prefer to plan our own agenda",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q33';
    }
  },

  Q33: {
    id: 'Q33',
    text: "How important is having wellness/spa facilities available?",
    type: 'multiple_choice',
    options: [
      "Very important - essential for relaxation",
      "Somewhat important - nice to have",
      "Not important - not a priority",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 3) return 'KNOWLEDGE_BASE';
      return 'Q34';
    }
  },

  Q34: {
    id: 'Q34',
    text: "What's your preferred communication style for planning?",
    type: 'multiple_choice',
    options: [
      "Email correspondence",
      "Phone/video calls",
      "In-person meetings",
      "Mix of all methods",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'Q35';
    }
  },

  Q35: {
    id: 'Q35',
    text: "Finally, what's the most important factor in choosing Green Office Villas?",
    type: 'multiple_choice',
    options: [
      "Unique combination of work and relaxation",
      "Eco-friendly and sustainable practices",
      "Professional support and service",
      "Value for money",
      "Let me ask a question"
    ],
    next: (answer: number) => {
      if (answer === 4) return 'KNOWLEDGE_BASE';
      return 'CONVERSATION_COMPLETE';
    }
  }
};

export class SimpleChatbot {
  private currentQuestion: string = 'Q1';
  private userResponses: Record<string, any> = {};

  constructor() {
    this.reset();
  }

  reset() {
    this.currentQuestion = 'Q1';
    this.userResponses = {};
  }

  getCurrentQuestion(): Question | null {
    return QUESTIONS[this.currentQuestion] || null;
  }

  processResponse(answer: any): { nextQuestion: string; response?: string } {
    const question = this.getCurrentQuestion();
    if (!question) return { nextQuestion: 'Q1' };

    // Store the response
    this.userResponses[question.id] = answer;

    // Knowledge base requests are now handled via custom question input

    // Get next question
    const nextQuestionId = question.next(answer);
    
    // Handle special cases
    if (nextQuestionId === 'LEAD_CAPTURE_WAITLIST') {
      return {
        nextQuestion: 'LEAD_CAPTURE',
        response: "We're expanding by 2027-2028 to accommodate larger groups. Would you like us to email you updates on availability?"
      };
    }

    if (nextQuestionId === 'LEAD_CAPTURE_TOO_LARGE') {
      return {
        nextQuestion: 'LEAD_CAPTURE',
        response: "That's quite a large group! We might be able to accommodate subgroups or have alternative suggestions. Would you like to discuss options via email?"
      };
    }

    if (nextQuestionId === 'CONVERSATION_COMPLETE') {
      return {
        nextQuestion: 'LEAD_CAPTURE',
        response: "Thank you for completing our retreat planning questionnaire! Based on your responses, Green Office Villas seems like an excellent fit for your team. We'd love to discuss your specific needs and provide a customized proposal. May we have your email to send you detailed information and pricing?"
      };
    }

    this.currentQuestion = nextQuestionId;
    return { nextQuestion: nextQuestionId };
  }



  calculateQualificationScore(): number {
    let score = 0;

    // Role and basic qualification (20 points)
    if (this.userResponses.Q1 === 0 || this.userResponses.Q1 === 1) score += 20;

    // Group size (20 points)
    if (this.userResponses.Q2_1 || this.userResponses.Q3) {
      const attendees = this.userResponses.Q2_1 || this.userResponses.Q3;
      if (attendees >= 10 && attendees <= 50) score += 20;
      else if (attendees >= 5 && attendees <= 100) score += 15;
      else if (attendees >= 1) score += 10;
    }

    // Timeline urgency (15 points)
    if (this.userResponses.Q8 !== undefined) {
      if (this.userResponses.Q8 === 0) score += 15; // Within 3 months
      else if (this.userResponses.Q8 === 1) score += 12; // 3-6 months
      else if (this.userResponses.Q8 === 2) score += 8; // 6-12 months
      else score += 5; // More than 12 months
    }

    // Budget alignment (15 points)
    if (this.userResponses.Q9 !== undefined) {
      if (this.userResponses.Q9 === 1 || this.userResponses.Q9 === 2) score += 15; // $500-$2000
      else if (this.userResponses.Q9 === 3) score += 12; // Over $2000
      else score += 8; // Under $500
    }

    // Decision-making authority (10 points)
    if (this.userResponses.Q11 !== undefined) {
      if (this.userResponses.Q11 === 0) score += 10; // Final decision maker
      else if (this.userResponses.Q11 === 1) score += 8; // Influencer
      else score += 5; // Researcher
    }

    // Sustainability alignment (10 points)
    if (this.userResponses.Q10 !== undefined && this.userResponses.Q10 <= 1) score += 10;

    // Company size (5 points)
    if (this.userResponses.Q12 !== undefined && this.userResponses.Q12 >= 1) score += 5;

    // Experience with retreats (5 points)
    if (this.userResponses.Q18 !== undefined && this.userResponses.Q18 <= 1) score += 5;

    return Math.min(score, 100);
  }

  getUserResponses(): Record<string, any> {
    return { ...this.userResponses };
  }

  getInitialGreeting(): string {
    return "Welcome! I'm here to help you explore Green Office Villas, a premium eco-friendly venue for productive team retreats featuring private villas with office spaces, high-speed internet, and amenities to strengthen team culture. Let's see if it's a fit—what best describes your role?";
  }
}
