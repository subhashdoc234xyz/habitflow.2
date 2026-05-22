# 🌱 HabitFlow — Complete Build Prompt
### *"Build Your Best Life, One Habit at a Time"*

> **Website Name:** **HabitFlow**
> **Tagline:** Track habits. Crush goals. Live intentionally.
> **Stack:** React + Vite · Firebase Auth · Supabase · Gemini API · Vercel

---

## 🧠 Role & Mindset

You are a **Senior Full-Stack Software Engineer** with 10+ years of experience building production-grade SaaS applications. You write clean, modular, scalable code with proper separation of concerns, error handling, and professional UI/UX. You think about edge cases, user experience, performance, and maintainability at every step.

You will build **HabitFlow** — a complete, fully functional all-in-one personal productivity web app — from scratch, following every instruction in this prompt precisely.

---

## 🗂️ Project Overview

**HabitFlow** is a personal life operating system that combines:
- ✅ Daily habit tracking with streaks and heatmaps
- 📋 Daily todo list with priority and recurring tasks
- 🎯 Goal setting with milestone tracking
- 📅 Interactive calendar showing habits, todos, and events
- 📊 Insights dashboard (rule-based analytics + Gemini AI summaries)
- 🧘 Daily morning/evening review with mood tracking
- 🏆 Gamification (XP, levels, badges)
- 🔐 Firebase email authentication

---

## 🛠️ Tech Stack (Exact Versions)

```
Frontend:      React 18 + Vite 5
Styling:       Tailwind CSS v3 + custom CSS variables
Icons:         Lucide React
Charts:        Recharts
Calendar:      react-calendar or custom built
Auth:          Firebase Authentication (email/password)
Database:      Supabase (PostgreSQL + Realtime)
AI Insights:   Google Gemini 1.5 Flash API (free tier)
Routing:       React Router v6
State:         Zustand
Notifications: react-hot-toast
Date Utils:    date-fns
Hosting:       Vercel
```

---

## 📁 Folder Structure

```
habitflow/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── AppLayout.jsx
│   │   ├── habits/
│   │   │   ├── HabitCard.jsx
│   │   │   ├── HabitForm.jsx
│   │   │   ├── HabitHeatmap.jsx
│   │   │   └── StreakBadge.jsx
│   │   ├── todos/
│   │   │   ├── TodoItem.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   └── TodoList.jsx
│   │   ├── goals/
│   │   │   ├── GoalCard.jsx
│   │   │   ├── GoalForm.jsx
│   │   │   └── MilestoneList.jsx
│   │   ├── calendar/
│   │   │   ├── CalendarView.jsx
│   │   │   └── DayDetailModal.jsx
│   │   ├── insights/
│   │   │   ├── InsightsDashboard.jsx
│   │   │   ├── RuleBasedInsights.jsx
│   │   │   └── GeminiInsights.jsx
│   │   ├── review/
│   │   │   ├── MorningReview.jsx
│   │   │   └── EveningReview.jsx
│   │   ├── gamification/
│   │   │   ├── XPBar.jsx
│   │   │   └── BadgeDisplay.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── Card.jsx
│   │       ├── Badge.jsx
│   │       ├── ProgressBar.jsx
│   │       └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── HabitsPage.jsx
│   │   ├── TodosPage.jsx
│   │   ├── GoalsPage.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── InsightsPage.jsx
│   │   ├── ReviewPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── AuthPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useHabits.js
│   │   ├── useTodos.js
│   │   ├── useGoals.js
│   │   ├── useInsights.js
│   │   └── useMood.js
│   ├── store/
│   │   ├── authStore.js
│   │   ├── habitStore.js
│   │   ├── todoStore.js
│   │   └── goalStore.js
│   ├── lib/
│   │   ├── firebase.js
│   │   ├── supabase.js
│   │   └── gemini.js
│   ├── utils/
│   │   ├── insights.js        ← Rule-based logic
│   │   ├── streaks.js
│   │   ├── xp.js
│   │   └── dateHelpers.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env.local
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔐 Environment Variables

Create `.env.local` with these keys:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Supabase
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Create `.env.example` as a copy with empty values for version control.

---

## 🗄️ Supabase Database Schema

Run these SQL migrations in Supabase SQL Editor in order:

```sql
-- USERS PROFILE (extends Firebase auth)
create table public.profiles (
  id uuid primary key,                    -- matches Firebase UID
  email text not null,
  name text,
  avatar_url text,
  timezone text default 'Asia/Kolkata',
  xp integer default 0,
  level integer default 1,
  created_at timestamptz default now()
);

-- HABITS
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  description text,
  category text default 'general',        -- health, fitness, learning, mindfulness, general
  color text default '#6366f1',
  frequency text default 'daily',         -- daily, weekdays, weekends, custom
  custom_days integer[],                  -- [0,1,2,3,4,5,6] (0=Sun)
  target_time text,                       -- 'morning', 'afternoon', 'evening', 'anytime'
  goal_id uuid,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- HABIT LOGS (daily completions)
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  completed_date date not null,
  completed boolean default false,
  note text,
  created_at timestamptz default now(),
  unique(habit_id, completed_date)
);

-- TODOS
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  priority text default 'medium',         -- low, medium, high
  due_date date,
  due_time time,
  completed boolean default false,
  completed_at timestamptz,
  is_recurring boolean default false,
  recurrence_rule text,                   -- daily, weekly, monthly
  tags text[],
  created_at timestamptz default now()
);

-- GOALS
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  deadline date,
  progress integer default 0,            -- 0-100
  status text default 'active',          -- active, completed, paused
  created_at timestamptz default now()
);

-- MILESTONES (sub-tasks of goals)
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid references goals(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  completed boolean default false,
  due_date date,
  created_at timestamptz default now()
);

-- MOOD LOGS
create table public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  log_date date not null,
  mood_score integer check (mood_score between 1 and 5),  -- 1=😴 2=😐 3=🙂 4=😄 5=🔥
  journal_note text,
  review_type text,                       -- 'morning', 'evening'
  top_intentions text[],
  created_at timestamptz default now(),
  unique(user_id, log_date, review_type)
);

-- BADGES
create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  badge_key text not null,               -- '7_day_streak', 'first_goal', etc.
  earned_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table habits enable row level security;
alter table habit_logs enable row level security;
alter table todos enable row level security;
alter table goals enable row level security;
alter table milestones enable row level security;
alter table mood_logs enable row level security;
alter table user_badges enable row level security;

-- RLS Policies (users can only access their own data)
create policy "Users own data" on profiles for all using (id::text = auth.uid()::text);
create policy "Users own habits" on habits for all using (user_id::text = auth.uid()::text);
create policy "Users own logs" on habit_logs for all using (user_id::text = auth.uid()::text);
create policy "Users own todos" on todos for all using (user_id::text = auth.uid()::text);
create policy "Users own goals" on goals for all using (user_id::text = auth.uid()::text);
create policy "Users own milestones" on milestones for all using (user_id::text = auth.uid()::text);
create policy "Users own moods" on mood_logs for all using (user_id::text = auth.uid()::text);
create policy "Users own badges" on user_badges for all using (user_id::text = auth.uid()::text);
```

---

## 🎨 Design System

### Color Palette (CSS Variables in globals.css)

```css
:root {
  --bg-primary:     #0f0f14;
  --bg-secondary:   #16161f;
  --bg-card:        #1c1c28;
  --bg-hover:       #23232f;
  --border:         #2a2a3a;
  --accent:         #6366f1;      /* Indigo — primary brand */
  --accent-light:   #818cf8;
  --accent-glow:    rgba(99, 102, 241, 0.15);
  --success:        #22c55e;
  --warning:        #f59e0b;
  --danger:         #ef4444;
  --text-primary:   #f1f1f5;
  --text-secondary: #8b8ba0;
  --text-muted:     #555568;
}
```

### Typography
- **Display/Headings:** `'Plus Jakarta Sans'` (Google Fonts)
- **Body:** `'Inter'` (Google Fonts)
- **Mono/Code:** `'JetBrains Mono'`

### Design Principles
- Dark-first design with deep navy/charcoal backgrounds
- Cards with subtle borders and slight glow on hover
- Indigo accent with glow effects on active/focus states
- Smooth transitions (200ms ease) on all interactive elements
- Micro-animations: checkmark bounce, streak fire pulse, XP bar fill
- Mobile-first responsive (sidebar collapses to bottom nav on mobile)

---

## 📄 Page-by-Page Feature Spec

### 1. `/auth` — Authentication Page
- Split layout: left side (branding, tagline, feature bullets), right side (form)
- Toggle between Login and Signup (animated transition)
- Fields: Name (signup only), Email, Password, Confirm Password (signup)
- Firebase email/password auth
- Show/hide password toggle
- Loading state on submit button
- Error messages with toast notifications
- After login → redirect to `/dashboard`
- Persist auth state (stay logged in on refresh)

### 2. `/dashboard` — Today's Dashboard
- Greeting: "Good morning, [Name] 🌤️" (time-aware)
- Today's date prominently shown
- **Today's Habits:** List of today's habits with one-tap check-off, completion % ring
- **Today's Focus:** Top 3 pinned todos
- **Quick Add:** Floating "+" button to add habit or todo instantly
- **Streak Summary:** Fire emoji + current best streak
- **XP + Level Bar:** Progress to next level
- **Mood Check-in Prompt** if not done today
- **Mini Calendar:** Current week with colored dots per day (habit completion)
- **Upcoming Goals:** 2 nearest deadline goals with progress bars

### 3. `/habits` — Habits Page
- List of all active habits grouped by category
- Each habit card shows:
  - Name, color tag, category icon
  - Current streak 🔥, best streak ⭐
  - Today's completion toggle (large, satisfying checkbox)
  - 7-day mini bar chart
- **GitHub-style Heatmap** (52 weeks × 7 days grid) at top of page
- Add/Edit habit modal with all fields
- Archive/delete habit with confirmation
- Filter by category tabs

### 4. `/todos` — Daily Todo List
- Tabs: Today | Upcoming | Completed
- Each todo:
  - Checkbox (check = strikethrough + completion animation)
  - Title, priority badge (colored), due time
  - Edit/delete on hover
  - Drag-to-reorder (using @dnd-kit)
- **Today's Focus** section: pin up to 3 todos
- Quick-add inline input at top
- Filter by priority
- Recurring todo support (badge shown)
- Empty state with motivational message

### 5. `/goals` — Goals Page
- Card grid: each goal shows title, category, deadline countdown, progress bar
- Click goal → expand to show milestones list
- Milestone checkboxes auto-update goal progress %
- Add/edit goal modal with:
  - Title, description, category, deadline
  - Link to a habit ("This goal is powered by habit: X")
- Status tabs: Active | Completed | Paused
- Confetti animation on 100% goal completion

### 6. `/calendar` — Calendar Page
- Full monthly calendar view
- Each day cell shows colored dots: 🔵 habits | 🟢 todos | 🔴 goal deadlines
- Click any day → side panel shows:
  - Habit completion list for that day
  - Todos due that day
  - Mood logged
  - Journal note
- Navigate months with prev/next arrows
- Today highlighted with accent ring

### 7. `/insights` — Insights & Analytics Page

#### Rule-Based Insights Panel (always shown)
Build `src/utils/insights.js` with these rules:

```javascript
// Example rules to implement (minimum 12 rules):
// 1. Best streak habit: "Your top habit is 'Read 30 min' with a 14-day streak!"
// 2. Weakest day: "You complete the fewest habits on Fridays (42% rate)"
// 3. Best day: "Monday is your power day — 94% habit completion"
// 4. Morning vs evening: "You complete morning habits 30% more than evening ones"
// 5. Overdue todos: "You have 5 todos overdue by 3+ days"
// 6. Goal at risk: "Goal 'Learn Spanish' is 20% done with only 10 days left"
// 7. Mood-habit correlation: "On days you exercise, your mood scores 4.2 vs 2.8 average"
// 8. Consistency score: "You've been consistent 6/7 days this week — excellent!"
// 9. Longest gap: "You skipped 'Meditate' for 4 days (Mar 12–16)"
// 10. Monthly completion: "This month: 78% habit completion — up 12% from last month"
// 11. Todo completion rate: "You complete 68% of todos you create"
// 12. Most productive week: "Your best week was March 4–10 (91% completion)"
```

Each insight is displayed as a card with:
- Icon, headline, supporting detail text
- Category tag (Habits | Goals | Todos | Mood)
- Severity/tone color (positive=green, warning=amber, info=indigo)

#### Gemini AI Summary Panel
- Button: "✨ Generate AI Insights"
- Collect last 30 days of habit_logs, todos completed, mood_logs from Supabase
- Build a structured prompt with this data
- Call Gemini 1.5 Flash API
- Display returned natural language summary in a styled card
- Show last generated time; cache result in localStorage for 6 hours
- Loading skeleton while generating

#### Charts Section
- **Habit Completion Rate** — 4-week bar chart (Recharts BarChart)
- **Mood Over Time** — Line chart (7 days)
- **Category Breakdown** — Donut/pie chart (habits by category completion)
- **Streak Leaderboard** — Top 5 habits by current streak

### 8. `/review` — Daily Review Page
- **Morning Review** (shown before noon):
  - "What's your intention for today?" (text input)
  - Pick top 3 todos for the day
  - Mood check-in (5 emoji options)
- **Evening Review** (shown after 5pm):
  - "How did today go?" (rate 1–5 stars)
  - "What did you accomplish?" (free text)
  - Habit completion summary for today
  - Mood check-in
- If already reviewed today, show that day's entry read-only

### 9. `/settings` — Settings Page
- **Profile:** Name, email (read-only), avatar upload
- **Preferences:** Timezone, theme (dark/light toggle)
- **Notifications:** Browser notification permission toggle
- **Account:** Change password, delete account (with confirmation)
- **Data:** Export all data as JSON

---

## 🏆 Gamification System

Implement in `src/utils/xp.js`:

```javascript
// XP Awards
const XP_REWARDS = {
  HABIT_COMPLETE: 10,
  TODO_COMPLETE: 5,
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 200,
  GOAL_COMPLETE: 100,
  MILESTONE_COMPLETE: 25,
  DAILY_REVIEW: 15,
  MOOD_LOG: 5,
};

// Level thresholds
const LEVELS = [
  { level: 1, name: 'Seedling', minXP: 0, maxXP: 100 },
  { level: 2, name: 'Sprout', minXP: 100, maxXP: 300 },
  { level: 3, name: 'Growing', minXP: 300, maxXP: 600 },
  { level: 4, name: 'Blooming', minXP: 600, maxXP: 1000 },
  { level: 5, name: 'Flourishing', minXP: 1000, maxXP: 1500 },
  { level: 6, name: 'Thriving', minXP: 1500, maxXP: 2200 },
  { level: 7, name: 'Mastery', minXP: 2200, maxXP: 3000 },
  { level: 8, name: 'Legend', minXP: 3000, maxXP: Infinity },
];

// Badges
const BADGES = [
  { key: 'first_habit', label: 'First Step', desc: 'Completed your first habit', icon: '🌱' },
  { key: 'streak_7', label: 'On Fire', desc: '7-day streak achieved', icon: '🔥' },
  { key: 'streak_30', label: 'Unstoppable', desc: '30-day streak achieved', icon: '⚡' },
  { key: 'todos_10', label: 'Task Master', desc: 'Completed 10 todos', icon: '✅' },
  { key: 'first_goal', label: 'Dream Chaser', desc: 'Created your first goal', icon: '🎯' },
  { key: 'goal_complete', label: 'Achiever', desc: 'Completed a goal', icon: '🏆' },
  { key: 'review_streak_7', label: 'Reflective', desc: '7 days of daily reviews', icon: '🧘' },
  { key: 'perfect_week', label: 'Perfect Week', desc: '100% habits for 7 days', icon: '💎' },
];
```

---

## 🤖 Gemini API Integration

File: `src/lib/gemini.js`

```javascript
// Model: gemini-1.5-flash (free tier: 1500 req/day)
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

const buildInsightPrompt = (data) => `
You are a personal productivity coach analyzing a user's habit and goal data.
Based on the data below, provide 3-5 personalized, actionable insights.
Be specific, encouraging, and use the actual data in your response.
Format: Return plain text insights separated by newlines, no markdown.

DATA:
- Period: Last 30 days
- Habit completion rate: ${data.completionRate}%
- Total habits tracked: ${data.totalHabits}
- Best streak: ${data.bestStreak} days (habit: ${data.bestStreakHabit})
- Average mood score: ${data.avgMood}/5
- Todos completed: ${data.todosCompleted}
- Goals in progress: ${data.activeGoals}
- Most missed habit: ${data.mostMissedHabit}
- Best day of week: ${data.bestDay}
- Worst day of week: ${data.worstDay}

Provide insights that help the user improve their habits and achieve their goals.
`;
```

---

## 🔁 Data Flow Architecture

```
Firebase Auth ──► uid ──► Supabase (all data queries use uid as user_id)

User logs in:
  1. Firebase returns uid + user object
  2. Zustand authStore saves user
  3. App fetches profile from Supabase profiles table
  4. If no profile → create one (first login)
  5. All subsequent queries filter by user_id = uid

Habit check-off flow:
  1. User taps habit checkbox
  2. Optimistic UI update (instant visual feedback)
  3. Upsert into habit_logs (habit_id, date, completed=true)
  4. Recalculate streak for that habit
  5. Award XP → update profiles.xp
  6. Check badge conditions → award new badges
  7. Show XP toast notification
```

---

## 📱 Responsive Layout

### Desktop (≥1024px)
- Fixed sidebar (240px wide) on left
- Main content area fills remaining space
- Two or three column grid for cards

### Tablet (768px–1023px)
- Collapsible sidebar with hamburger toggle
- Two column grid

### Mobile (<768px)
- No sidebar — fixed bottom navigation bar (5 icons)
- Single column layout
- Bottom sheet modals instead of centered modals
- Large touch targets (min 44px)

---

## ⚙️ Key Implementation Details

### Firebase Auth Setup (`src/lib/firebase.js`)
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Supabase Client (`src/lib/supabase.js`)
```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Protected Routes
Wrap all app routes in an `<AuthGuard>` component that:
- Reads from `authStore`
- If not authenticated → redirect to `/auth`
- If authenticated → render children
- Show full-screen loading spinner while auth state is loading

### Error Handling
- All Supabase queries wrapped in try/catch
- Network errors → show toast with retry option
- Form validation errors → inline field errors
- Global error boundary component wrapping the app

### Performance
- Lazy load all page components with `React.lazy` + `Suspense`
- Memoize expensive calculations (streak calculation, insight rules) with `useMemo`
- Debounce search/filter inputs (300ms)
- Paginate habit logs (load last 365 days max)

---

## 🚀 Deployment: Vercel

### Step 1: Prepare Repository
```bash
# Initialize project
npm create vite@latest habitflow -- --template react
cd habitflow
npm install

# Install all dependencies
npm install @supabase/supabase-js firebase zustand react-router-dom \
  lucide-react recharts react-hot-toast date-fns @dnd-kit/core \
  @dnd-kit/sortable @dnd-kit/utilities react-calendar

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Initialize git
git init
git add .
git commit -m "initial: HabitFlow project setup"

# Push to GitHub
gh repo create habitflow --public --push
```

### Step 2: Configure Tailwind
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#6366f1',
        'accent-light': '#818cf8',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Step 3: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Link to GitHub repo
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist

# Set environment variables in Vercel dashboard:
# Project Settings → Environment Variables → Add all from .env.local
```

### Step 4: Configure Vercel for SPA Routing
Create `vercel.json` in project root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Step 5: Supabase Auth Configuration
In Supabase Dashboard → Authentication → URL Configuration:
- Add your Vercel domain to **Site URL**: `https://habitflow.vercel.app`
- Add to **Redirect URLs**: `https://habitflow.vercel.app/**`

### Step 6: Firebase Auth Configuration
In Firebase Console → Authentication → Settings → Authorized domains:
- Add: `habitflow.vercel.app`

### Continuous Deployment
- Push to `main` branch → Vercel auto-deploys
- Pull requests → Vercel creates preview URLs automatically

---

## 🧪 Testing Checklist (Before Launch)

- [ ] Auth: signup, login, logout, stay logged in on refresh
- [ ] Habits: create, edit, delete, check-off, streak updates correctly
- [ ] Todos: create, complete, drag reorder, recurring todos
- [ ] Goals: create, add milestones, complete milestones, progress auto-updates
- [ ] Calendar: all days show correct dots, day panel shows correct data
- [ ] Insights: rule-based insights load correctly, Gemini API call works
- [ ] Review: morning/evening review saves, shows read-only after submission
- [ ] Gamification: XP awards on actions, level-up notification
- [ ] Mobile: all pages usable on 375px screen
- [ ] RLS: user A cannot see user B's data (test with 2 accounts)
- [ ] Performance: no unnecessary re-renders, lazy loading works

---

## 📋 Build Order (Follow This Sequence)

Build in this exact order to avoid dependency issues:

```
1.  Project setup + Tailwind + routing skeleton
2.  Firebase + Supabase client setup
3.  Auth page (login + signup) + Firebase auth
4.  AuthGuard + Zustand authStore + profile creation
5.  AppLayout (sidebar + topbar + responsive nav)
6.  Habits page (CRUD + check-off + streak logic)
7.  Habit heatmap component
8.  Todos page (CRUD + drag-and-drop)
9.  Goals page + Milestones
10. Calendar page
11. Dashboard (pulls from all other modules)
12. Rule-based insights utility + InsightsPage
13. Gemini API integration
14. Daily Review page + Mood tracking
15. Gamification (XP + badges)
16. Settings page
17. Mobile responsive polish
18. Error handling + loading states polish
19. Deploy to Vercel + environment variables
20. Final testing checklist
```

---

## 💡 Additional Notes for the Developer

- **Never store Firebase UID in a separate column** — use it directly as the Supabase `profiles.id` (UUID type)
- **Always use `date-fns` for date logic** — never raw JS Date manipulation
- **Optimistic updates:** Update UI first, then sync to Supabase, rollback on error
- **Streak calculation:** A streak is consecutive days where `completed = true` in `habit_logs`. If today has no log entry, the streak is still valid until end of day.
- **Gemini rate limiting:** Cache the AI response in localStorage with a 6-hour TTL. Show a "Refresh Insights" button after TTL expires.
- **Accessibility:** All interactive elements must have `aria-label`. Use semantic HTML. Keyboard navigable.
- **Security:** Never expose API keys in client-side code except via `VITE_` prefixed variables (Vite handles this). Supabase RLS is your true security layer.

---

*Built with ❤️ using HabitFlow — Track habits. Crush goals. Live intentionally.*
