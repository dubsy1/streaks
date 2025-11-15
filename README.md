# Streaks - Habit Tracker

A modern, fast, and lightweight habit tracking app inspired by Habitica - but better and without the lag!

## Features

- **Three Task Types**:
  - **Habits**: Track positive habits (gain rewards) or negative habits (lose health)
  - **Dailies**: Recurring tasks on specific days of the week
  - **To-Dos**: One-time tasks

- **Gamification**:
  - Level up by earning XP
  - Earn gold for completing tasks
  - Health system that decreases when you do bad habits
  - Difficulty levels affect rewards (trivial, easy, medium, hard)

- **Streak Tracking**:
  - Visual streak counter with flame icon
  - Automatic streak calculation based on consecutive completions

- **Performance**:
  - Built with Vite for blazing-fast development and builds
  - Lightweight React + TypeScript
  - Offline-first with localStorage persistence
  - No backend required - all data stored locally

- **Clean UI**:
  - Modern, responsive design with Tailwind CSS
  - Smooth animations and transitions
  - Intuitive interface

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool (much faster than CRA)
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **localStorage** - Data persistence

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd streaks
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Add a Task**: Click "Add New Task" and fill in the details
   - Choose task type (Habit, Daily, or To-Do)
   - Set difficulty level (affects XP and gold rewards)
   - For habits, choose positive (gain rewards) or negative (lose health)
   - For dailies, select which days to repeat

2. **Complete Tasks**: Click the checkmark to mark tasks complete
   - Gain XP and gold for completing good tasks
   - Lose health for completing bad habits
   - Build streaks by completing tasks consecutively

3. **Level Up**: Fill your XP bar to level up and continue growing!

4. **Track Progress**: Monitor your health, XP, gold, and streaks at the top

## Why Better than Habitica?

- **Lightning Fast**: No server lag, instant responses
- **Offline Support**: Works without internet connection
- **Minimal Design**: Clean, focused interface without distractions
- **Privacy**: All data stays on your device
- **Free**: No premium features or paywalls
- **Open Source**: Fully customizable

## Data Storage

All data is stored locally in your browser's localStorage. Your tasks and stats persist across sessions but are device-specific. To backup your data, you can export localStorage or use browser sync features.

## Development

### Project Structure

```
src/
├── components/       # React components
│   ├── AddTaskForm.tsx
│   ├── StatsBar.tsx
│   └── TaskItem.tsx
├── utils/           # Utility functions
│   ├── dateUtils.ts
│   ├── gameUtils.ts
│   ├── storage.ts
│   └── streakUtils.ts
├── types.ts         # TypeScript type definitions
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Future Enhancements

Potential features to add:
- Cloud sync
- Data export/import
- Custom themes
- Achievements/badges
- Statistics and charts
- Reminders/notifications
- Mobile app version

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with React, TypeScript, and Vite
