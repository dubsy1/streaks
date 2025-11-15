# Complete Game Logic Guide

Your Streaks app now includes essential game mechanics that make it feel polished and prevent cheating!

## 🎮 New Game Features

### 1. Character Always Visible
**Your character is now at the top of the screen at all times!**

- **Location:** Integrated into the stats bar (top of page)
- **Shows:**  - Current equipped hat
  - Character mood based on health
  - Health indicator dots

- **Mood System:**
  - 🟢 **Happy** (80-100% health) - Blue/bright colors
  - 🟡 **Neutral** (50-79% health) - Yellow colors
  - 🟠 **Worried** (20-49% health) - Orange colors
  - 🔴 **Critical** (0-19% health) - Red, pulsing animation

### 2. Daily Reset System
**Automatic punishment for incomplete dailies!**

- **When:** Triggers when you open the app on a new day
- **What it does:**
  - Checks all dailies that were scheduled for yesterday
  - If you didn't complete them, you take damage!
  - Damage amount depends on task difficulty

- **Damage Values:**
  - Trivial: -0.5 HP
  - Easy: -1 HP
  - Medium: -2 HP
  - Hard: -3 HP

- **Example:**
  ```
  Yesterday you had 3 dailies:
  - "Exercise" (Hard) - Not completed
  - "Meditate" (Medium) - Completed ✓
  - "Read" (Easy) - Not completed

  Today you lose: 3 HP (hard) + 1 HP (easy) = 4 HP total
  Notification: "❌ Lost 4.0 HP for 2 incomplete dailies!"
  ```

### 3. Habit Cooldown System
**Prevents spamming habits for infinite rewards!**

- **Cooldown:** 5 minutes between completions for habits
- **Applies to:** Habit tasks only (not dailies or to-dos)
- **What happens:**
  - Complete a habit → 5 minute cooldown starts
  - Try to complete again → Shows cooldown timer
  - Must wait before completing again

- **Notification Example:**
  ```
  "⏳ Cooldown: 3m 45s remaining"
  ```

- **Why:** Prevents clicking "Drink water" 100 times to farm gold/XP

### 4. Streak Bonus System
**Rewards for consistency!**

- **How it works:**
  - Complete a task multiple days in a row
  - Get bonus XP and gold based on streak length

- **Bonus Multipliers:**
  - 1-2 days: No bonus (1.0x)
  - 3-6 days: +20% rewards (1.2x)
  - 7+ days: +50% rewards (1.5x)

- **Example:**
  ```
  Task: "Exercise" (Medium difficulty)
  Base reward: 10 XP, 1.5 gold

  Day 1-2: 10 XP, 1.5 gold
  Day 3-6: 12 XP, 1.8 gold (+20%)
  Day 7+: 15 XP, 2.25 gold (+50%)
  ```

- **Notification:**
  ```
  "🔥 7 day streak! +15 XP, +2.25 gold"
  ```

### 5. Level-Up Celebrations
**Special notification when you level up!**

- **Triggers:** When your XP bar fills and you level up
- **Notification:**
  ```
  "🎉 LEVEL UP! Now level 5!"
  ```

- **What happens:**
  - XP resets (overflow carries over)
  - Level increases by 1
  - Big celebration notification

### 6. Real-Time Notifications
**Instant feedback for every action!**

All actions show a temporary notification at the top of the screen:

| Action | Notification |
|--------|-------------|
| Complete good task | ✅ +10 XP, +1.5 gold |
| Complete with streak | 🔥 7 day streak! +15 XP, +2.25 gold |
| Complete bad habit | 💔 -2 HP |
| Level up | 🎉 LEVEL UP! Now level 5! |
| Habit on cooldown | ⏳ Cooldown: 3m 45s remaining |
| Purchase hat | 🎩 Purchased Classic Cap! |
| Not enough gold | ❌ Need 5.5 more gold! |
| Equip hat | 👤 Equipped Wizard Hat! |
| Remove hat | 👤 Hat removed |
| Incomplete dailies | ❌ Lost 4.0 HP for 2 incomplete dailies! |

**Display:** 3-second toast at top center of screen

## 🎯 Strategy Tips

### Maximize Rewards:
1. **Build streaks** - Complete tasks daily for 7+ days to get 1.5x rewards
2. **Prioritize hard tasks** - More XP and gold
3. **Complete all dailies** - Avoid health damage penalties

### Avoid Punishment:
1. **Don't skip dailies** - You'll lose health the next day
2. **Watch your health** - If it gets too low, character shows critical mood
3. **Plan ahead** - Set realistic dailies you can actually complete

### Efficient Gameplay:
1. **Habits** - Good for quick XP, but 5min cooldown prevents spam
2. **Dailies** - Must do regularly or face penalties
3. **To-Dos** - One-time tasks, complete when ready

## 🔧 Technical Details

### Daily Check Logic:
```typescript
// Runs on app startup
1. Check if it's a new day (compare to last check)
2. If new day:
   - Find all dailies scheduled for yesterday
   - Find which ones weren't completed
   - Calculate total damage
   - Apply damage to health
   - Show notification
```

### Streak Calculation:
```typescript
// How streaks are counted
1. Sort completion dates newest to oldest
2. Check if today OR yesterday is included
3. Count consecutive days backwards
4. Return streak length
```

### Cooldown Storage:
- Stored in localStorage per task ID
- Key: `last_completion_{taskId}`
- Value: Timestamp of last completion
- Checked before allowing habit completion

## 📊 Balance Tuning

Current values can be adjusted in the code:

### Cooldowns:
```typescript
// In App.tsx
const HABIT_COOLDOWN_MINUTES = 5; // Change to adjust cooldown
```

### Streak Bonuses:
```typescript
// In App.tsx toggleTask function
const streakBonus =
  streak >= 7 ? 1.5 :  // 7+ days: 50% bonus
  streak >= 3 ? 1.2 :  // 3+ days: 20% bonus
  1.0;                 // < 3 days: no bonus
```

### Daily Damage:
```typescript
// In gameUtils.ts calculateDamage function
const baseDamage = {
  trivial: 0.5,
  easy: 1,
  medium: 2,
  hard: 3,
};
```

### Rewards:
```typescript
// In types.ts
export const DIFFICULTY_XP = {
  trivial: 1,
  easy: 5,
  medium: 10,
  hard: 15,
};

export const DIFFICULTY_GOLD = {
  trivial: 0.5,
  easy: 1,
  medium: 1.5,
  hard: 2,
};
```

## 🎨 Visual Feedback

### Character Mood Colors:
- Happy (80-100% HP): Blue (#60a5fa)
- Neutral (50-79% HP): Yellow (#fbbf24)
- Worried (20-49% HP): Orange (#fb923c)
- Critical (0-19% HP): Red (#ef4444) + pulsing animation

### Health Indicator Dots:
- 3 dots below character
- Green when health is good
- Fade to gray as health decreases

### Notifications:
- Background: Dark gray (#111827)
- Text: White
- Animation: Bounce entrance
- Duration: 3 seconds
- Position: Top center, fixed

## 🚀 Future Enhancement Ideas

Potential additions you could make:

1. **Death System:**
   - What happens when health reaches 0?
   - Lose gold? Lose streak? Reset level?

2. **Health Regeneration:**
   - Slowly regain health each day
   - Or purchase health potions with gold

3. **Achievements:**
   - "7-day streak master"
   - "100 tasks completed"
   - "Reach level 10"

4. **Power-ups:**
   - 2x XP for 1 hour (costs gold)
   - Skip cooldown (costs gold)
   - Protect from daily damage (costs gold)

5. **Sound Effects:**
   - Level up sound
   - Damage sound
   - Purchase confirmation sound

6. **Stat Tracking:**
   - Total tasks completed
   - Longest streak
   - Total gold earned

## 📱 Mobile Behavior

All features work perfectly on mobile:
- Character visible at all times
- Notifications appear at top
- Cooldown timers work
- Daily reset triggers on app open
- Touch-friendly interface

## 🎓 User Education

Consider adding a tutorial or help section explaining:
- What streaks do (bonus rewards)
- Why habits have cooldowns (prevent cheating)
- What happens if you miss dailies (health damage)
- How character mood works (based on health)

---

**Your app now has all the essential game mechanics that make it engaging and balanced!** 🎮
