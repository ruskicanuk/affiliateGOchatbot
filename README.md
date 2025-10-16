# Green Office Chatbot - Simplified POC

## 📚 Core Documentation
**IMPORTANT**: Always reference these 4 core documentation files before making any changes:

1. **[CHATBOT_FLOW_DOCUMENTATION.md](docs/CHATBOT_FLOW_DOCUMENTATION.md)** - Complete conversation flow (Q1-Q35), branching logic, and user interaction patterns
2. **[KNOWLEDGE_BASE_DOCUMENTATION.md](docs/KNOWLEDGE_BASE_DOCUMENTATION.md)** - Knowledge base content, search algorithms, and response templates
3. **[DATA_MODEL_DOCUMENTATION.md](docs/DATA_MODEL_DOCUMENTATION.md)** - Database schema, TypeScript interfaces, and data relationships
4. **[TECH_STACK_IMPLEMENTATION_PLAN.md](docs/TECH_STACK_IMPLEMENTATION_PLAN.md)** - Technology stack, project structure, and implementation phases

## 🚀 Quick Start
```bash
# Install dependencies
npm install

# Set up environment
cp .env.local
# Edit .env.local with your credentials

# Start development
npm run dev
```

## 🏗️ Architecture (Simplified)
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL) - 3 tables only
- **LLM**: OpenAI GPT-4
- **Knowledge Base**: Static TypeScript file with keyword matching
- **State Management**: React useState (no Zustand)
- **Forms**: Simple HTML forms (no React Hook Form)

## 📋 Development Guidelines
1. Always check the 4 core docs before implementing features
2. Follow the conversation flow structure in CHATBOT_FLOW_DOCUMENTATION.md
3. Use knowledge base content from KNOWLEDGE_BASE_DOCUMENTATION.md
4. Implement data models as specified in DATA_MODEL_DOCUMENTATION.md
5. Follow the tech stack decisions in TECH_STACK_IMPLEMENTATION_PLAN.md

## 🎯 Core Features (POC)
- **Bot-driven conversation flow**
- **Knowledge base interruptions**
- **Basic lead qualification and scoring**
- **Simple admin dashboard for viewing leads**
- **Console logging for analytics**

## 🎯 Implemented Features

### Chat Interface
- Complete Q1-Q25 conversation flow with dynamic branching
- Knowledge base integration with "Let me ask a question" interruptions
- OpenAI GPT-4 enhanced responses with static fallback
- Session persistence and recovery
- Mobile-responsive design

### Lead Qualification System
- Sophisticated 100-point scoring algorithm
- Multiple qualification criteria (role, budget, timeline, authority)
- Automatic lead categorization and prioritization
- Email capture with validation

### Admin Dashboard
- Real-time session analytics and metrics
- Lead qualification scores and detailed breakdowns
- Export qualified leads to CSV with complete data
- Session details with full conversation history
- Password-protected access

### Knowledge Base
- Static TypeScript knowledge base with keyword matching
- OpenAI GPT-4 integration for complex queries
- Comprehensive coverage of pricing, location, amenities, booking
- Fallback mechanisms for reliability

## 🔧 Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
ADMIN_PASSWORD=your_admin_password
```

## 📊 Database Setup
1. Create a new Supabase project
2. Run the SQL from `database-setup.sql` in your Supabase SQL editor
3. Verify the 3 tables are created: `chat_sessions`, `chat_messages`, `knowledge_queries`

## 🚀 Deployment
The application is ready for deployment to Vercel:
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📈 Success Metrics
This POC successfully demonstrates:
- Complete conversation flow implementation (35 questions)
- Advanced lead qualification and scoring
- OpenAI GPT-4 integration with fallbacks
- Comprehensive admin analytics
- Production-ready deployment configuration