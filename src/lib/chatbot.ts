// Core chatbot logic rebuilt to match CHATBOT_FLOW_DOCUMENTATION.md
import { Question } from '@/types';

// Complete question flow implementation based on documentation
export const QUESTIONS: Record<string, Question> = {
  Q1: {
    id: 'Q1',
    text: "What best describes your role?",
    type: 'multiple_choice',
    options: [
      "Our clients engage me (or my company) to help facilitate retreats in some manner (e.g., planner/platform/consultants)",
      "We are looking at options for an upcoming team retreat (eg. I am a team leader, team assistant, etc)"
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
    text: "We may be a great fit! Green Office is purpose-built to help retreat planners/platforms/consultants offer deeply differentiated retreat experiences to your clients. What are you focused on at the moment?",
    type: 'multiple_choice',
    options: [
      "I am planning an upcoming retreat for a client — curious if Green Office is a fit",
      "Exploring potential venues for our platform or portfolio"
    ],
    next: (answer: number) => {
      if (answer === 0) return 'Q2_1';
      if (answer === 1) return 'Q2_2_1';
      return 'Q2';
    }
  },

  Q2_1: {
    id: 'Q2_1',
    text: "Perfect, let's sketch out the retreat plan",
    type: 'multiple_choice',
    options: ["Continue to retreat planning"],
    next: (answer: number) => 'Q3' // Skip to Q3 and follow the flow from there
  },

  Q2_2_1: {
    id: 'Q2_2_1',
    text: "Interesting, Green Office might help differentiate your platform versus the competition. I feel we may want to escalate your interest to a meeting with our leadership team to explore partnership models. How many retreats are organized by your company or through your platform per year?",
    type: 'multiple_choice',
    options: [
      "Fewer than 10",
      "10 to 100", 
      "100 to 1,000",
      "1,000+"
    ],
    next: (answer: number) => 'Q2_2_2'
  },

  Q2_2_2: {
    id: 'Q2_2_2',
    text: "What best describes the scale of average retreat organized by your company or through your platform?",
    type: 'multiple_choice',
    options: [
      "Consistently small (less than 20 per retreat on average) with little variation",
      "Small (less than 20 per retreat on average) but ranges widely",
      "Consistently moderate (20-50 per retreat on average) with little variation", 
      "Moderate (20-50 per retreat on average) but ranges widely",
      "Consistently large (over 50 per retreat on average) with little variation",
      "Large (over 50 per retreat on average) but ranges widely"
    ],
    next: (answer: number) => {
      if (answer >= 0 && answer <= 3) return 'Q2_2_3'; // Options 1-4
      if (answer === 4) return 'PLANNER_LEAD_CAPTURE'; // Option 5
      if (answer === 5) return 'Q2_2_3'; // Option 6
      return 'Q2_2_2';
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
    next: (answer: number) => 'PLANNER_PROSPECT_CAPTURE'
  },

  // Branch B: Actual Retreat Path, Determining Fit (Q1 → Q3)
  Q3: {
    id: 'Q3',
    text: "Great, I have three critical questions to see if Green Office is a possible fit based on the number (estimated or actual) of retreat attendees, the (approximate or actual) retreat date and its estimated duration. Don't worry about perfect detail accuracy quite yet - let's see if we are in the approximate zone. How many attendees do you expect?",
    type: 'number',
    validation: { min: 0, required: true },
    next: (answer: number) => {
      if (answer >= 2 && answer <= 50) return 'Q4';
      if (answer === 1) return 'ACTUAL_RETREAT_LEAD_CAPTURE';
      if (answer > 50) return 'ACTUAL_RETREAT_LEAD_CAPTURE';
      if (answer === 0) return 'ACTUAL_RETREAT_LEAD_CAPTURE';
      return 'Q3'; // Invalid input - repeat question
    }
  },

  Q4: {
    id: 'Q4',
    text: "What approximate date do you aim to start the retreat on?",
    type: 'date',
    validation: { required: true },
    next: (answer: string) => {
      const inputDate = new Date(answer);
      const cutoffDate = new Date('2026-11-01');
      if (inputDate < cutoffDate) return 'ACTUAL_RETREAT_LEAD_CAPTURE';
      return 'Q5';
    }
  },

  Q5: {
    id: 'Q5', 
    text: "Approximately, how many days long do you expect the retreat to run?",
    type: 'number',
    validation: { min: 1, required: true },
    next: (answer: number) => {
      if (answer >= 3 && answer <= 120) return 'Q6';
      return 'ACTUAL_RETREAT_PROSPECT_CAPTURE'; // Any other value
    }
  },

  Q6: {
    id: 'Q6',
    text: "Since Green Office is a good fit for your team, we could wrap up this chat with next steps or, if you prefer, I have a longer list of detailed retreat planning questions. If you have the time, the detailed retreat questions will allow our team to better prepare for our follow up meeting and should make that meeting sail by faster. The questions may also help you think through the retreat planning details. Let me know which you prefer?",
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
    text: "Great! Let's get into it - I have 18 questions for you which should take 4 - 5 minutes. What are Primary retreat goals? (you may select more than 1)",
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
      "Would prefer Green Office manages all transportation to/from the Airport",
      "Would prefer to manage all transportation to/from the Airport ourselves (eg. car rental, taxi, etc)"
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
      "Attendees each have a private villas (maximum privacy)"
    ],
    next: (answer: number[]) => 'Q13'
  },

  Q13: {
    id: 'Q13',
    text: "Any pets or family inclusions?",
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
    text: "What is your company's Overall size?",
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
    text: "What is a line or two description of the role the team (attending the retreat) plays in the company?",
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
    next: (answer: boolean) => 'ACTUAL_RETREAT_PROSPECT_CAPTURE'
  }
};

export class SimpleChatbot {
  private currentQuestion: string = 'Q1';
  private userResponses: Record<string, any> = {};
  private conditionalQuestions: string[] = []; // Track which conditional questions to show

  constructor() {
    this.reset();
  }

  reset() {
    this.currentQuestion = 'Q1';
    this.userResponses = {};
    this.conditionalQuestions = [];
  }

  getCurrentQuestion(): Question | null {
    return QUESTIONS[this.currentQuestion] || null;
  }

  processResponse(answer: any): { nextQuestion: string; response?: string } {
    const question = this.getCurrentQuestion();
    if (!question) return { nextQuestion: 'Q1' };

    // Store the response
    this.userResponses[question.id] = answer;

    // Handle special conditional logic for Q7
    if (question.id === 'Q7') {
      this.conditionalQuestions = [];

      // Handle both array format (from new multi-select) and string format (legacy)
      let selectedIndices: number[] = [];
      if (Array.isArray(answer)) {
        selectedIndices = answer;
      } else if (typeof answer === 'string') {
        // Handle comma-separated string format
        selectedIndices = answer.split(',').map(Number).filter(n => !isNaN(n));
      } else if (typeof answer === 'number') {
        selectedIndices = [answer];
      }

      if (selectedIndices.includes(0)) this.conditionalQuestions.push('Q8'); // Team-building
      if (selectedIndices.includes(1)) this.conditionalQuestions.push('Q9'); // Work-output
      if (selectedIndices.includes(2)) this.conditionalQuestions.push('Q10'); // Relaxation-celebration

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
      // Remove completed question from conditional list
      const currentIndex = this.conditionalQuestions.indexOf(question.id);
      if (currentIndex !== -1) {
        this.conditionalQuestions.splice(currentIndex, 1);
      }
      
      // Move to next conditional question or Q11
      if (this.conditionalQuestions.length > 0) {
        this.currentQuestion = this.conditionalQuestions[0];
        return { nextQuestion: this.conditionalQuestions[0] };
      } else {
        this.currentQuestion = 'Q11';
        return { nextQuestion: 'Q11' };
      }
    }

    // Get next question
    const nextQuestionId = question.next(answer);
    
    // Handle special ending cases
    if (nextQuestionId === 'PLANNER_LEAD_CAPTURE') {
      return {
        nextQuestion: 'LEAD_CAPTURE',
        response: "Hope this interaction was helpful. I'll update our team with the summary"
      };
    }

    if (nextQuestionId === 'PLANNER_PROSPECT_CAPTURE') {
      return {
        nextQuestion: 'LEAD_CAPTURE',
        response: "Hope this interaction was helpful. Based on our chat, I expect your organization and Green Office should be a good fit. I suggest we organize a 20m introductory call with our team - does that work?"
      };
    }

    if (nextQuestionId === 'ACTUAL_RETREAT_LEAD_CAPTURE') {
      return {
        nextQuestion: 'LEAD_CAPTURE',
        response: "I'll update our team with the summary of our chat. The fit today may not be perfect, but I suspect we'll want to stay in touch."
      };
    }

    if (nextQuestionId === 'ACTUAL_RETREAT_PROSPECT_CAPTURE') {
      return {
        nextQuestion: 'LEAD_CAPTURE',
        response: "Based on our chat, I expect your organization and Green Office should be a good fit. I suggest we organize a 20m introductory call with our team to get further into your retreat details - does that work?"
      };
    }

    this.currentQuestion = nextQuestionId;
    return { nextQuestion: nextQuestionId };
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
    return "Welcome! I'll ask a series of questions to help you explore whether Green Office is a fit. At any time, you may pause this series of questions by asking any question on your mind (using the 'Ask your own question' option).";
  }
}
