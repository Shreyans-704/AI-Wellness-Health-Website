live website :-https://wellnessaiweb.netlify.app/
```markdown
# AI Wellness - Personal AI Health Advisor

A production-ready full-stack medical AI application providing intelligent diagnosis support, real-time health monitoring, and clinical decision-making powered by advanced AI technology.

## 🎯 Features

### Core Capabilities
- **Medical AI Query** - Ask health-related questions and get AI-powered insights
- **Personal Details Management** - Collect and store patient information
- **Health Assessment** - Track vitals, symptoms, and risk factors
- **AI-Generated Health Reports** - Professional PDF reports with risk scoring
- **Secure Data Storage** - All patient data stored in Supabase with HIPAA compliance
- **PDF Management** - Auto-generated and stored health reports

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS 3 + Shadcn/UI
- **Backend**: Express.js (TypeScript)
- **Database**: Supabase PostgreSQL
- **APIs**: Gemini 2.5 Flash for AI responses
- **Storage**: Supabase Storage for PDF files
- **Testing**: Vitest
- **Authentication

**: Clerk

## 📋 Project Structure

```

<img width="1642" height="865" alt="image" src="https://github.com/user-attachments/assets/d09914da-241a-4b6f-bdf2-b7e57a464400" />

<br> 

```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (preferably with pnpm)
- Supabase account
- Gemini API key

### Installation

```bash
# Clone repository
git clone https://github.com/Shreyans-704/AI-Wellness-Health-Website.git
cd "AI Wellness Website"

# Install dependencies
pnpm install

# Create .env file
# Add these variables:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# GEMINI_API_KEY=your_gemini_api_key
# VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
# CLERK_SECRET_KEY=your_clerk_secret
```

### Development

```bash
# Start dev server (client + backend)
pnpm dev

# Open browser
http://localhost:8080
```

### Build & Deploy

```bash
# Production build
pnpm build

# Start production server
pnpm start

# TypeScript validation
pnpm typecheck

# Run tests
pnpm test
```

## 🗄️ Database Schema

### `personal_details` Table
```sql
- id (uuid) - Primary key
- user_id (text)
- full_name (text)
- age (int)
- gender (text)
- medical_history (text)
- current_medications (text)
- allergies (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### `health_data` Table
```sql
- id (uuid) - Primary key
- user_id (text)
- blood_pressure (text)
- heart_rate (int)
- blood_glucose (int)
- cholesterol (int)
- created_at (timestamp)
```

## 🤖 AI Configuration

The app uses **Gemini 2.5 Flash** with adaptive response styling:

- **Short queries** ("hi", "fever?") → Quick 2-4 line responses
- **Complex questions** → Detailed structured explanations
- **Max tokens**: 2000 (ensures comprehensive responses)
- **Temperature**: 0.7 (balanced creativity & accuracy)

### Example Queries
```
Short: "What is a fever?"
→ "A fever is usually a sign your body is fighting an infection..."

Long: "Explain diabetes in detail"
→ Structured response with Initial Assessment, Detailed Explanation, 
   Key Points, Recommendations, Warning Signs, Disclaimer
```

## 📊 Key Pages

### Home (Index.tsx)
- Hero section with wellness background image
- Medical AI Query search box
- Feature cards preview
- Call-to-action buttons

### Personal Details
- Form to collect patient information
- Auto-save to Supabase
- PDF generation for personal details
- Professional formatted PDF storage

### Health Assessment
- Symptom and risk factor selection
- Vital signs input (BP, HR, SpO2, Temperature)
- AI-generated health report with risk scoring
- Professional PDF generation
- Auto-upload to Supabase Storage
- Form reset after PDF generation

## 🔒 Security Features

- **HIPAA Compliant** - Encrypted patient data storage
- **RLS Policies** - Row-level security on Supabase
- **Service Role Keys** - Server-side PDF uploads bypass RLS
- **Environment Variables** - API keys never exposed in client
- **Clerk Authentication** - User identity management

## 📦 API Endpoints

### `/api/gemini` (POST)
```json
Request: { "query": "Your health question" }
Response: { "response": "AI-generated answer", "query": "..." }
```

### `/api/upload-pdf` (POST)
```json
Request: { "fileName": "PatientName/file.pdf", "fileData": "base64..." }
Response: { "success": true, "filePath": "..." }
```

### `/api/ping` (GET)
Health check endpoint

### `/api/demo` (GET)
Demo endpoint

## 🎨 Styling

- **TailwindCSS 3** - Utility-first CSS framework
- **Color Scheme** - Blue primary, Gray accents
- **Components** - Pre-built Shadcn/UI library
- **Glass Morphism** - Semi-transparent cards with backdrop blur
- **Responsive** - Mobile-first, fully responsive design

## 📱 Features by Page

### Home
- Adaptive AI search (responds based on query complexity)
- Beautiful wellness background image
- Semi-transparent glass morphism cards
- Feature previews

### Personal Details
- 6-field form (name, age, gender, medical history, medications, allergies)
- Data persistence in Supabase
- Professional PDF with patient information
- PDF stored in nested patient folders

### Health
- Comprehensive health assessment
- Symptoms and risk factor checkboxes
- Vital signs input (BP, HR, SpO2, Temperature)
- AI-calculated risk score
- Professional health report with urgency levels
- PDF auto-upload to Supabase Storage
- Form auto-reset after PDF generation

## 🚀 Deployment

### Netlify/Vercel
1. Push code to GitHub
2. Connect repository to Netlify/Vercel
3. Set environment variables in dashboard
4. Auto-deploy on push

### Manual Deployment
```bash
pnpm build
# Deploy ./dist and server files to your hosting
```

## 📝 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Development
PING_MESSAGE=pong
```

## 🔧 Troubleshooting

### PDF not saving to database?
- Verify health_data table schema matches expected fields
- Check Supabase RLS policies allow inserts
- Confirm service role key is configured

### AI responses too brief?
- Verify GEMINI_API_KEY is set correctly
- Check Gemini API quota limits
- Response length is configurable in gemini.ts (maxOutputTokens)

### Background image not showing?
- Ensure `wellness-background.jpg` exists in public folder
- Hard refresh browser (Ctrl + Shift + R)
- Clear browser cache

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**AI Wellness v2.0** - Your Personal AI Health Advisor
