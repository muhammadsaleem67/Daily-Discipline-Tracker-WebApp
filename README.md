# Daily Discipline — Dashboard Edition

> **Command the routine. Own the outcome.**  
> A high-performance habit and discipline tracking dashboard built for students, athletes, and professionals executing rigorous daily routines.

---

## 🎯 Product Vision

Daily Discipline is an uncompromising personal performance dashboard. Unlike soft wellness trackers or corporate task managers, Daily Discipline is engineered for people who value precision, accountability, and unrelenting consistency.

- **Dark-First Executive Aesthetic**: Built strictly with a deep teal color system inspired by elite performance and training consoles.
- **Resilient Streak Logic**: Designed with real-world adaptations (such as "Pause Day" protection and per-task "N/A" exemptions) so genuine recovery or travel never invalidates months of earned progress.
- **Dynamic Context Synchronization**: Habit times can be dynamically driven by solar/prayer schedules (Fajr, Maghrib, Isha) alongside fixed clock hours.
- **Zero-Latency Private Storage**: Every user's routines, notes, and metrics are completely isolated at the data layer.

---

## 🎨 Official Color Palette

The interface is styled using the warm golden-amber and roasted-umber Color Hunt palette (`#F9E6A8`, `#F2A900`, `#CC6F00`, `#4D2A00`):

| Hex Code | Name | Architectural Role |
| :--- | :--- | :--- |
| **`#4D2A00`** | Roasted Umber | Deep card surfaces, module panels, modal backgrounds, and primary structures |
| **`#CC6F00`** | Burnt Bronze / Ochre | Primary action triggers, active navigation items, interactive filter tabs |
| **`#F2A900`** | Golden Amber | Glowing streak flame, progress ring fills, active chart caps, success states |
| **`#F9E6A8`** | Light Warm Cream | High-contrast display headlines, tabular metrics, legible body prose |
| **`#1B0F03`** | Deep Espresso Shadow | Deep background canvas, inset card wells, dark input fields |

---

## ⚡ Complete Feature Breakdown

### 1. Authentication & Private Account Isolation
- **Email & Password Authentication**: Instant registration and login with local cryptographic session storage.
- **Google Sign-In**: Streamlined one-click OAuth authentication flow.
- **One-Click Demo Personas**:
  - `Alex Rivera` (Disciplined Founder — includes 60 days of seeded realistic history).
  - `Tariq Mansour` (Student Athlete).
- **Private Data Partitioning**: Every account's routines, course logs, settings, and daily notes are isolated by unique user ID (`daily_discipline_<userId>`). No user can view or alter another user's records.
- **Starter Routine Auto-Seeding**: When a new account registers, a sensible 14-task daily routine spanning 4 key phases is automatically provisioned.

---

### 2. Today Dashboard (`/today`)
- **Motivational Performance Header**:
  - Displays greeting, current date, and an algorithmic rotating stoic motivation quote.
  - Quick **Date Navigation Stepper** (`< Yesterday`, `Today`, `Tomorrow >`) to review or backfill records.
  - **Hero Circular Completion Ring**: Live graphical percentage and fraction of completed tasks for the active day.
- **"Pause Day" Control**:
  - Freezes active tracking for travel, illness, or planned physical recovery.
  - Protects and preserves the user's ongoing streak without penalties.
- **Quiet Evening Warning Alert**:
  - Automatically activates after 18:00 if the day's completion is under 75%.
  - Directs immediate focus toward unfinished physical or intellectual priorities before night shutdown.
- **Current Streak Card**:
  - Large tabular numeral display with animated glowing flame icon (`#78CDD7`).
  - **All-Time Longest Streak** trophy counter.
  - **7-Day Status Trail**: Monday–Sunday visual status dots indicating completed, paused, pending, or missed days.
- **Secondary Stat Cards Row**:
  - **Current Streak**: Active days vs best record.
  - **7-Day Rolling Consistency**: Target $\ge 80\%$.
  - **30-Day Monthly Rate**: Rolling macro discipline percentage.
  - **Completed Reps**: Total tasks completed across account lifetime.
- **Routine Phase Module Cards**:
  - Pre-grouped into daily execution phases:
    1. **Morning Routine** (e.g. Hydration, Fajr Prayer, Cold Rinse, Mission Targets).
    2. **Deep Work & Study** (e.g. 90m Focus Sprint, Technical Reading, Communications Triage).
    3. **Physical & Health** (e.g. Resistance Training, High-Protein Fuel, Maghrib Grounding).
    4. **Evening Shutdown** (e.g. Digital Sunset, Isha Retrospective, Gear Staging, Lights Out).
  - Each module card features:
    - **Phase Progress Ring**: Compact SVG circular completion meter.
    - **Weekly Cadence Bar**: 7 individual daily indicators (`M T W T F S S`) tracking weekly consistency for that specific phase.
    - **Expandable / Collapsible Checklist**: Collapses clean for focused mobile review.
    - **Check-off Button**: 44px minimum touch target with smooth teal transition.
    - **"N/A" (Not Applicable) Toggle**: Exempts a task on non-applicable days (e.g., rest days) so the percentage denominator stays mathematically accurate without penalizing the user.
    - **Dynamic Time & Recurrence Badges**: Displays scheduled time, recurrence frequency (*Daily*, *Weekdays*, *Weekends*), and dynamic prayer links.
- **GitHub-Style Consistency Heatmap**:
  - Prominent 20-week calendar grid using 5 distinct teal intensity levels.
  - Month indicators across the top with Monday–Sunday rows.
  - Interactive cell inspection: click any square to inspect that date's completion percentage, tasks checked, and notes.
  - Week pagination controls to navigate earlier or later calendar windows.
  - Prominent metric badges: **This Month Consistency %** and **Best Month Consistency %**.
- **Weekly Progress Bar Chart**:
  - Vertical bar columns from Monday to Sunday displaying daily completion rates.
  - Glowing `#78CDD7` cap highlights the active day.
  - Displays weekly average performance score.
- **Daily Field Log (Notes)**:
  - Rich text log for recording training weights, deep work output, focus obstacles, or evening reflections.
  - Automatically saved per selected calendar date.

---

### 3. Performance Insights & Analytics (`/insights`)
- **Full-Size 26-Week Consistency Heatmap**: Extended 6-month visual record of uninterrupted execution.
- **Rolling Metric Cards**: Live 7-day and 30-day completion averages.
- **Primary Resistance Points (Most Skipped Tasks)**:
  - Ranked bar list highlighting the exact habits with the highest skip rates.
  - Pinpoints friction areas to optimize routine sustainability.
- **Habit Reliability Score**:
  - Ranked leaderboard showing consistency percentage across every single routine habit.
- **Historical Date Inspector**:
  - Search any past calendar date with an integrated date picker.
  - Inspect retro-logs, notes, and task completion rates.

---

### 4. Courses & Long-Term Trackers (`/courses`)
- Independent long-term progress trackers for macro goals outside daily checklists:
  - Academic textbooks, certifications, coding bootcamps.
  - Half-marathon or athletic volume progressions.
  - Reading challenges and skill acquisition milestones.
- **Module Cards with Circular Rings**: Displays percentage completion and unit counts (e.g. `"18 of 28 Modules"`, `"11 of 16 Weeks"`).
- **Fast Increment / Decrement Controls**: One-tap `+` / `-` buttons to log completed units.
- **Course Management**:
  - Add new courses with custom categories, units, and targets.
  - Edit existing tracker parameters or delete obsolete trackers.

---

### 5. Settings & Routine Architecture (`/settings`)
- **Dynamic Prayer Times Sync**:
  - Configurable times for **Fajr**, **Maghrib**, and **Isha**.
  - Any task linked to a prayer dynamically updates its scheduled time across the entire dashboard in real-time.
- **Routine Architect (Full Task Editor)**:
  - **Add Habit**: Create new habits with custom phases, times, recurrence, and prayer links.
  - **Reorder Habits**: Move habits up or down with ordering arrows to control checklist sequence.
  - **Recurrence Settings**: Set tasks to apply to *Every Day*, *Weekdays Only (Mon–Fri)*, or *Weekends Only (Sat–Sun)*.
  - **Prayer Link Binding**: Bind tasks to Fajr, Maghrib, or Isha, or use fixed clock times.
  - **Delete Habit**: Remove obsolete routine items.
- **Data Management & Privacy**:
  - **Export JSON Backup**: Download a complete, portable JSON backup of all tasks, logs, courses, and settings.
  - **Import JSON Backup**: Restore or migrate data seamlessly from a backup file.
  - **Seed 60-Day Discipline History**: One-click demo seed to populate the heatmap and charts with realistic historical data.
  - **Reset to Defaults**: Restore starter routines at any time.
- **User Account Switcher**:
  - Switch between registered profiles or test personas without clearing data.
  - Secure sign-out.

---

### 6. Milestone Breakthrough System
- Automated celebration modal triggered upon reaching key discipline milestones:
  - **7 Days** (Habit Formed)
  - **14 Days** (Fortitude Built)
  - **30 Days** (Standard Established)
  - **60 Days** (Identity Shift)
  - **100 Days** (Mastery Level)
  - **365 Days** (Unbroken Year)
- Badges are permanently recorded in the user's settings profile.

---

### 7. Responsive Mobile-First Architecture
- **Mobile (< 640px)**:
  - High-density single-column layout.
  - Fixed bottom tab bar (`Today`, `Insights`, `Courses`, `Settings`) with touch targets $\ge 44\text{px}$.
  - Horizontal smooth scrolling containers for heatmaps and charts to eliminate page-width breakage.
- **Tablet (640px – 1024px)**:
  - Two-column adaptive card grid with condensed header controls.
- **Desktop (> 1024px)**:
  - Full persistent 260px sidebar navigation.
  - Multi-column dashboard grid mirroring the high-energy performance console reference.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Functional components, custom hooks, Context API)
- **Language**: TypeScript 5.8+ (Strict mode, strong typing throughout)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` with custom teal design tokens)
- **Icons**: Lucide React
- **Build Tool**: Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **Typography**: Google Fonts (*Plus Jakarta Sans* for headers/body, *JetBrains Mono* for tabular metrics)

---

## 📁 Directory Structure

```
├── index.html                   # HTML entry point with fonts & metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & project scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── index.css                # Tailwind CSS v4 setup & custom scrollbars
│   ├── App.tsx                  # Root layout, router, modal controllers
│   ├── types/
│   │   └── index.ts             # Core TypeScript interfaces (Task, DailyLog, Course, etc.)
│   ├── utils/
│   │   ├── constants.ts         # Starter routines, quotes, default prayer times
│   │   └── date.ts              # Streak math, progress algorithms, heatmap builders
│   ├── context/
│   │   ├── AuthContext.tsx      # User authentication, demo personas & session storage
│   │   └── DataContext.tsx      # Habit persistence, streak computation & task actions
│   └── components/
│       ├── layout/
│       │   ├── Sidebar.tsx      # Desktop persistent navigation bar
│       │   └── MobileNav.tsx    # Mobile bottom tab navigation & top brand header
│       ├── common/
│       │   ├── CircularProgress.tsx # SVG animated completion ring
│       │   ├── StreakCard.tsx       # Streak flame card with 7-day dot trail
│       │   ├── DayIndicatorDots.tsx # M T W T F S S weekly cadence indicator
│       │   └── MilestoneModal.tsx   # Streak milestone celebration modal
│       ├── dashboard/
│       │   ├── HeaderBanner.tsx     # Hero banner, date stepper, pause button
│       │   ├── StatCardsRow.tsx     # 4-card metric overview
│       │   ├── PhaseModuleCard.tsx  # Expandable routine checklist card
│       │   ├── ConsistencyHeatmap.tsx # GitHub-style 20-week teal grid
│       │   ├── WeeklyBarChart.tsx   # Mon–Sun progress bar chart
│       │   ├── DailyNotesCard.tsx   # Daily retrospective field notes
│       │   └── TodayView.tsx        # Dashboard home view
│       ├── insights/
│       │   └── InsightsView.tsx     # Full analytics, resistance points, date inspector
│       ├── courses/
│       │   └── CoursesView.tsx      # Multi-week long-term tracker view & modals
│       ├── settings/
│       │   └── SettingsView.tsx     # Prayer times, task editor, JSON backup & seed
│       └── auth/
│           └── AuthModal.tsx        # Sign-in, sign-up & demo switch modal
```

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Building for Production

```bash
# Verify TypeScript and linting
npm run lint

# Build production bundle
npm run build
```

---

## 🔒 Data Privacy Note

All habits, notes, prayer times, and logs are stored privately in user-partitioned local storage. No tracking data is shared across user accounts or uploaded to unauthorized third parties. Exporting your JSON file from **Settings > Data Management** gives you complete ownership and portability over your performance history.
