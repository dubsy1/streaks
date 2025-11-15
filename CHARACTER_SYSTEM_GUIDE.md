# Character Customization System Guide

Your Streaks app now has a complete character customization system with hats, shop, and inventory!

## ✨ New Features

### 1. Character Display (👤 Character Tab)
- Shows your character with equipped hat overlaid on top
- Hat positioning: automatically placed above character's head
- Displays currently equipped hat name
- Fallback to default character if image missing

### 2. Hat Shop (🛒 Shop Tab)
- 6 different hats available for purchase
- Rarity tiers: Common, Rare, Epic, Legendary
- Price range: 10 - 200 gold
- Color-coded rarity badges
- Lock icon when you can't afford a hat
- "Owned" badge for already purchased hats

### 3. Inventory (🎒 Inventory Tab)
- View all owned hats
- Click to equip/unequip hats
- "No Hat" option to remove hat
- Visual indicator showing which hat is equipped
- Empty state when no hats owned yet

## 🎮 How It Works

### Earning Gold
Complete tasks to earn gold:
- Trivial tasks: 0.5 gold
- Easy tasks: 1 gold
- Medium tasks: 1.5 gold
- Hard tasks: 2 gold

### Buying Hats
1. Go to 🛒 Shop tab
2. Browse available hats
3. Click "Buy" if you have enough gold
4. Hat automatically added to your inventory

### Equipping Hats
1. Go to 🎒 Inventory tab
2. Click any owned hat to equip it
3. Click "No Hat" to remove hat
4. View your character in 👤 Character tab

## 🎩 Available Hats

| Hat | Price | Rarity | Description |
|-----|-------|--------|-------------|
| Classic Cap | 10 gold | Common | A stylish classic cap |
| Wizard Hat | 50 gold | Rare | Mystical and magical |
| Crown | 100 gold | Epic | Fit for royalty |
| Dragon Helmet | 200 gold | Legendary | Legendary dragon-slayer gear |
| Party Hat | 30 gold | Common | Time to celebrate! |
| Top Hat | 75 gold | Rare | Classy and sophisticated |

## 📸 Adding Your Images

### Required Images

1. **Character Image:**
   - Path: `/home/user/streaks/public/character.png`
   - Your image: `/Users/ebbe/Desktop/STOCKHOLM/Streaks/Gubbar/Gemini_Generated_Image_vksqa6vksqa6vksq.png`

2. **First Hat (Classic Cap):**
   - Path: `/home/user/streaks/public/hats/hat-1.png`
   - Your image: `/Users/ebbe/Desktop/STOCKHOLM/Streaks/Hattar/Gemini_Generated_Image_7du4w17du4w17du4-removebg-preview.png`

### Quick Copy Commands

```bash
# Copy character
cp "/Users/ebbe/Desktop/STOCKHOLM/Streaks/Gubbar/Gemini_Generated_Image_vksqa6vksqa6vksq.png" /home/user/streaks/public/character.png

# Copy first hat
cp "/Users/ebbe/Desktop/STOCKHOLM/Streaks/Hattar/Gemini_Generated_Image_7du4w17du4w17du4-removebg-preview.png" /home/user/streaks/public/hats/hat-1.png

# Rebuild app
cd /home/user/streaks
npm run build
```

### Image Requirements

**Character Image:**
- Format: PNG (any size, will be scaled to fit)
- Should show character from chest/waist up
- Leave space above head for hat overlay

**Hat Images:**
- Format: PNG with transparent background
- Should be positioned to sit on character's head
- Same scale/proportions as character
- Remove background (already done for your first hat!)

### Adding More Hats

If you have more hat images, add them as:
- `/home/user/streaks/public/hats/hat-2.png` - Wizard Hat
- `/home/user/streaks/public/hats/hat-3.png` - Crown
- `/home/user/streaks/public/hats/hat-4.png` - Dragon Helmet
- `/home/user/streaks/public/hats/hat-5.png` - Party Hat
- `/home/user/streaks/public/hats/hat-6.png` - Top Hat

## 🛠️ Customizing the Shop

Edit `/home/user/streaks/src/data/hats.ts` to:
- Change hat prices
- Modify hat names/descriptions
- Change rarity levels
- Add more hats

Example:
```typescript
{
  id: 'hat-7',
  name: 'Viking Helmet',
  image: '/hats/hat-7.png',
  price: 150,
  description: 'For true warriors!',
  rarity: 'epic',
}
```

## 🎨 Hat Overlay Positioning

The hat overlay uses CSS transform to position it above the character:
```typescript
style={{ transform: 'translateY(-10%)' }}
```

If hats don't align perfectly:
1. Edit `/home/user/streaks/src/components/CharacterDisplay.tsx`
2. Adjust the `translateY` value (e.g., `-15%` for higher, `-5%` for lower)
3. Can also use `translateX` for horizontal adjustment

## 💾 Data Persistence

All character data is saved in localStorage:
- Owned hats list
- Currently equipped hat
- Gold balance

Data persists across sessions on the same device/browser.

## 🚀 Testing Without Images

The app works with placeholder fallbacks:
- Character shows as a blue circle with smiley face
- Hats show as gray boxes with 🎩 emoji

You can test all functionality before adding real images!

## 📱 Mobile Experience

All features work perfectly on mobile:
- Swipe between tabs
- Tap to purchase hats
- Tap to equip/unequip
- Responsive layout

## 🎯 Next Steps

1. **Add your character and hat images** (see commands above)
2. **Test the shop** - complete some tasks to earn gold
3. **Buy your first hat** - Classic Cap costs only 10 gold
4. **Equip it** - see it on your character!
5. **Add more hats** - customize the collection

## 🐛 Troubleshooting

**Images not showing:**
- Check file paths are exactly correct
- Rebuild: `npm run build`
- Clear browser cache

**Hats not aligned:**
- Adjust `translateY` in CharacterDisplay.tsx
- Ensure hat images are same scale as character

**Can't afford hats:**
- Complete more tasks to earn gold
- Start with cheaper Common hats (10-30 gold)

---

**Ready to customize your character? Add your images and start shopping!** 🎉
