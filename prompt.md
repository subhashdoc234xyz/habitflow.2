You are a senior frontend developer. Rebuild the entire HabitFlow habit tracker 
app from scratch with a premium WHITE glassmorphism design system. 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- React + TypeScript + Vite
- Tailwind CSS v3
- Framer Motion (animations)
- Recharts (charts)
- React Router DOM (routing)
- Lucide React (icons)
- date-fns (date handling)
- Keep all existing Firebase/Supabase auth and data logic exactly as is
- Only rebuild the UI layer — do NOT touch backend, auth, or data logic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL DESIGN SYSTEM — WHITE GLASSMORPHISM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKGROUND (body / root):
  background: linear-gradient(135deg, #e8d5ff 0%, #d4e4ff 30%, #fce4ff 60%, #e0f0ff 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;

FLOATING BACKGROUND ORBS (position:fixed, z-index:0, pointer-events:none):
  Orb 1: width:700px height:700px top:-200px left:-200px border-radius:50%
    background: radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)
    filter: blur(80px) animation: floatOrb1 10s ease-in-out infinite
  Orb 2: width:600px height:600px bottom:-150px right:-150px border-radius:50%
    background: radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)
    filter: blur(80px) animation: floatOrb2 13s ease-in-out infinite
  Orb 3: width:500px height:500px top:45% left:38% border-radius:50%
    background: radial-gradient(circle, rgba(236,72,153,0.1), transparent 70%)
    filter: blur(100px) animation: floatOrb3 9s ease-in-out infinite

  @keyframes floatOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
  @keyframes floatOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
  @keyframes floatOrb3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-30px)} }

GLASS CARD (use everywhere — every panel, card, modal, form):
  background: rgba(255, 255, 255, 0.45)
  backdrop-filter: blur(24px) saturate(180%)
  -webkit-backdrop-filter: blur(24px) saturate(180%)
  border: 1px solid rgba(255, 255, 255, 0.75)
  border-radius: 24px
  box-shadow: 
    0 8px 32px rgba(139,92,246,0.10),
    0 2px 8px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.9),
    inset 0 -1px 0 rgba(139,92,246,0.05)
  padding: 28px

GLASS CARD HOVER:
  transform: translateY(-3px)
  box-shadow:
    0 16px 48px rgba(139,92,246,0.16),
    0 4px 12px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,0.95)
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPOGRAPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Page title (h1): font-size:32px font-weight:800 
  color: transparent
  background: linear-gradient(135deg, #6d28d9, #4f46e5, #7c3aed)
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
  letter-spacing: -0.5px

Section heading (h2): font-size:20px font-weight:700 color:#1e1b4b
Card label: font-size:13px font-weight:500 color:rgba(109,40,217,0.6) letter-spacing:0.04em
Body text: font-size:15px color:#374151
Muted text: font-size:13px color:rgba(107,114,128,0.8)
Stat number: font-size:36px font-weight:800
  background: linear-gradient(135deg, #7c3aed, #4f46e5)
  -webkit-background-clip: text -webkit-text-fill-color: transparent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3D SHINY PRIMARY BUTTON (all main CTAs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
position: relative
overflow: hidden
background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%)
border: 1px solid rgba(255,255,255,0.4)
border-radius: 14px
padding: 12px 24px
color: white
font-size: 14px
font-weight: 700
letter-spacing: 0.02em
cursor: pointer
box-shadow:
  0 4px 0 #4c1d95,
  0 8px 24px rgba(109,40,217,0.45),
  inset 0 1px 0 rgba(255,255,255,0.4),
  inset 0 -1px 0 rgba(0,0,0,0.15)
transform: translateY(0px)
transition: all 0.15s cubic-bezier(0.4,0,0.2,1)

SHINE SWEEP (::before pseudo):
  content:''
  position:absolute top:0 left:-120% width:60% height:100%
  background: linear-gradient(120deg,
    transparent 0%,
    rgba(255,255,255,0) 20%,
    rgba(255,255,255,0.45) 50%,
    rgba(255,255,255,0) 80%,
    transparent 100%)
  animation: shineSweep 2.8s ease-in-out infinite
  border-radius: inherit
  pointer-events: none

@keyframes shineSweep {
  0%   { left: -120% }
  55%  { left: 160% }
  100% { left: 160% }
}

BUTTON HOVER:
  transform: translateY(-2px)
  box-shadow:
    0 6px 0 #4c1d95,
    0 14px 32px rgba(109,40,217,0.55),
    inset 0 1px 0 rgba(255,255,255,0.45)

BUTTON ACTIVE (click):
  transform: translateY(3px)
  box-shadow:
    0 1px 0 #4c1d95,
    0 4px 12px rgba(109,40,217,0.35),
    inset 0 2px 4px rgba(0,0,0,0.15)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECONDARY BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
background: rgba(255,255,255,0.6)
border: 1px solid rgba(139,92,246,0.35)
border-radius: 12px, padding: 10px 20px
color: #6d28d9, font-weight: 600
box-shadow: 0 2px 8px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.9)
hover: background rgba(255,255,255,0.85), border-color rgba(139,92,246,0.6)

GHOST / ICON BUTTON:
background: rgba(139,92,246,0.08)
border: 1px solid rgba(139,92,246,0.2)
border-radius: 10px, width:36px height:36px
color: #7c3aed
hover: background rgba(139,92,246,0.16), scale(1.05)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT FIELDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
background: rgba(255,255,255,0.65)
border: 1.5px solid rgba(139,92,246,0.25)
border-radius: 12px
padding: 12px 16px
font-size: 14px, color: #1e1b4b
box-shadow: inset 0 2px 4px rgba(139,92,246,0.06), 0 1px 0 rgba(255,255,255,0.9)
transition: all 0.2s ease
placeholder-color: rgba(107,114,128,0.6)

FOCUS:
border-color: rgba(124,58,237,0.6)
box-shadow: 
  0 0 0 4px rgba(124,58,237,0.12),
  inset 0 2px 4px rgba(139,92,246,0.08)
outline: none

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIDEBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
width: 240px, height: 100vh, position: fixed
background: rgba(255,255,255,0.5)
backdrop-filter: blur(28px) saturate(200%)
border-right: 1px solid rgba(255,255,255,0.8)
box-shadow: 4px 0 24px rgba(139,92,246,0.08)
padding: 24px 16px
display: flex, flex-direction: column, gap: 4px
z-index: 50

LOGO "HabitFlow":
  font-size: 22px, font-weight: 800
  background: linear-gradient(135deg, #7c3aed, #4f46e5)
  -webkit-background-clip: text, -webkit-text-fill-color: transparent
  margin-bottom: 32px, padding-left: 8px

NAV ITEM (default):
  display:flex align-items:center gap:10px
  padding: 10px 14px, border-radius: 14px
  color: #6b7280, font-size:14px font-weight:500
  transition: all 0.2s ease
  hover: background rgba(139,92,246,0.08) color:#7c3aed

NAV ITEM (active):
  background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))
  border: 1px solid rgba(124,58,237,0.25)
  border-radius: 14px
  color: #6d28d9, font-weight: 700
  box-shadow: 0 2px 12px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.8)
  position:relative
  ::before: content:'' position:absolute left:0 top:20% height:60%
    width:3px border-radius:0 3px 3px 0
    background: linear-gradient(180deg,#7c3aed,#4f46e5)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGES — BUILD EACH ONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

--- LOGIN PAGE ---
Full screen gradient background + floating orbs
Center card (max-width:440px) with glass style:
  Logo at top center with gradient text + sparkle icon
  Tagline: "Build better habits, one day at a time"
  Input fields: Email + Password with icons inside (left-side)
  "Remember me" checkbox + "Forgot password?" link (purple)
  Primary 3D shiny button "Sign in" full width
  Divider "or continue with"
  Google OAuth button: white glass style with Google icon
  "Don't have an account? Sign up" link at bottom
  Animated floating card entrance: framer motion fade+slide up

--- DASHBOARD ---
Top header: "Good morning/afternoon, [name] ☀️" + date (right-aligned settings icon)
Below header, grid layout (main 2/3 + sidebar 1/3):

LEFT COLUMN:
  XP Progress Card:
    Glass card, "Level 1: Seedling 🌱"
    Progress bar: 
      track: rgba(139,92,246,0.12) height:10px border-radius:99px
      fill: linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b) with shimmer animation
      Label left: "Level 1" right: "Next: Level 2"
    XP count badge: glass pill top-right

  Today's Habits Card:
    Header: "Today's Habits" + icon + "+ Add" ghost button (top right)
    Each habit row: glass inner card with:
      Color dot (habit color) + habit name + category badge + streak 🔥
      Right: checkbox (unchecked: border dashed purple; checked: gradient fill + checkmark)
      Completed: line-through opacity-50 + green glass badge "Done ✓"
    Empty state: centered illustration-style icon, text, + big shiny button

  Today's Focus (Todos) Card:
    Header + "+ Add task" button
    Each todo: checkbox + task name + time badge + priority dot
    Priority dots: red=high orange=medium blue=low

RIGHT COLUMN:
  Streak Card: 
    glass card, "🔥 Best Streak" large number gradient, "days" muted
  
  Completion Ring:
    SVG circle, stroke: url(gradient) purple-to-pink strokeWidth:8
    Center: big % number gradient text, "done" muted below
  
  This Week strip:
    7 day pills in a glass card
    Default: white glass pill, day letter + date number
    Today: gradient purple pill, white text, glow shadow
    Has habits: small colored dot below date number
  
  Upcoming Goals:
    Each goal: glass card with icon + name + progress bar + deadline badge

--- HABITS PAGE ---
Header: "Habits" gradient title + subtitle + "+ New Habit" 3D button top right
Activity Heatmap: full-width glass card with GitHub-style grid
  Empty cells: rgba(139,92,246,0.08)
  Filled cells gradient: light purple → deep purple by intensity
  Months labeled above, days left side

Filter tabs row:
  Glass pill container, tabs: All Health Fitness Learning Mindfulness General
  Active: gradient purple fill, inactive: ghost

Habit cards grid (2 columns):
  Each card: glass card with:
    Top: color accent bar (4px, full width, rounded top, habit color)
    Icon (large, 40px, in glass circle) + habit name (bold) + category badge
    Streak row: 🔥 N days + "Best: N days"
    Last 7 days dots (filled = done, empty = missed)
    Progress bar (this week completion %)
    Bottom: "Edit" ghost button + "Mark done today" primary mini button

Empty state: centered, large icon, message, shiny CTA button

--- TODOS PAGE ---
Header: gradient title "Today's Focus" + date + "+ Add Task" button
Filter: All | Today | This Week | Completed (glass tab pills)

Each todo card:
  Glass card with left accent border (color by priority: red/orange/blue)
  Checkbox (custom — glass circle, checked = gradient fill)
  Task title (completed = strikethrough, opacity 60%)
  Row of badges: time badge (clock icon) + priority badge + category tag
  Right: edit icon + delete icon (ghost buttons)

Quick-add form (collapsible glass card):
  Task name input + time picker + priority selector + category
  "Add Task" primary button + "Cancel" secondary button

--- GOALS PAGE ---
Header: "Goals" + "+ New Goal" 3D button
Stats row (3 glass metric cards): Active Goals | Completed | Success Rate

Each goal: tall glass card
  Top colored accent gradient bar (custom per goal)
  Goal title bold + description muted
  Category badge + deadline badge
  Big progress bar with % label
  Milestones section: checklist of sub-tasks inside
  Bottom: "View Details" ghost + "Update Progress" primary mini button

--- CALENDAR PAGE ---
Header: "Calendar" + month navigation arrows (glass pill < Month Year >)
View toggle: Month | Week (glass tab)

Month grid:
  Glass card containing 7-col grid
  Day cell: glass inner card (rounded-xl)
  Today: gradient purple background
  Days with habits: colored dots below date
  Click day: slide-up drawer showing that day's habits + todos

--- INSIGHTS PAGE ---
Header: "Insights" + "Generate AI Report" shiny button (amber gradient variant)

Stats row: 4 glass metric cards (Weekly %, Best Streak, Total Done, Mood Avg)

Charts (each in glass card with title):
  Habit Completion Rate (4 weeks): Recharts AreaChart
    fill: url(#purpleGradient) stroke:#7c3aed strokeWidth:2.5
  Mood Over Time (7 days): Recharts LineChart
    stroke:#ec4899 strokeWidth:2 dot filled pink

AI Coach section: glass card with purple-left-border accent
  "AI Coach" heading + Gemini badge
  Generated insight text in styled blockquote
  Shimmer loading state while generating

--- REVIEW PAGE ---
Weekly review glass card: rating stars + text area + submit
Monthly stats summary: heatmap + best habits list

--- SETTINGS PAGE ---
Sections in glass cards:
  Profile: avatar circle + name + email + "Edit Profile" button
  Notifications: toggle switches (glass pill toggles, purple when on)
  Appearance: theme selector, accent color picker
  Data: Export CSV button + Delete Account (danger, red glass)
  About: version + links

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATIONS (use Framer Motion)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Page transition: fade + slide up (y:20→0, opacity:0→1, duration:0.35)
Card entrance: staggered fade+scale (scale:0.96→1, stagger:0.06s)
Button press: scale(0.97) on tap
Checkbox check: spring scale pop
Habit complete: confetti burst (use canvas-confetti)
Streak increase: number count-up animation
Modal open: scale(0.9→1) + fade, backdrop blur in
Tab switch: sliding underline indicator

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Create a glassCard component: const GlassCard = ({children,className}) => 
  wraps children in a div with the full glass style applied via cn()
- Create a PrimaryButton component with the 3D shine animation built in
- Create a GlassInput component with the focus ring style
- All spacing: use multiples of 4px (4,8,12,16,20,24,28,32,40,48)
- Main content padding-left: 240px (sidebar width) + 32px padding
- Grid gap: 20px everywhere
- Mobile: sidebar collapses to bottom nav bar on <768px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DO NOT CHANGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- All Firebase/Supabase auth logic
- All data fetching hooks and context providers  
- All routing (React Router paths)
- All backend API calls
- Database schema or collections
- Environment variables

ONLY rebuild: every .tsx/.jsx UI component, all CSS/Tailwind classes,
all animations, layout, spacing, colors, and component structure.
Build this like a senior developer shipping a premium SaaS product.