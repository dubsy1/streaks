# How to Add Your Character and Hat Images

## Quick Method

Run these commands in your terminal:

```bash
# Copy character image
cp "/Users/ebbe/Desktop/STOCKHOLM/Streaks/Gubbar/Gemini_Generated_Image_vksqa6vksqa6vksq.png" /home/user/streaks/public/character.png

# Copy hat image
cp "/Users/ebbe/Desktop/STOCKHOLM/Streaks/Hattar/Gemini_Generated_Image_7du4w17du4w17du4-removebg-preview.png" /home/user/streaks/public/hats/hat-1.png
```

## Manual Method

1. **Character Image:**
   - Copy: `/Users/ebbe/Desktop/STOCKHOLM/Streaks/Gubbar/Gemini_Generated_Image_vksqa6vksqa6vksq.png`
   - To: `/home/user/streaks/public/character.png`

2. **First Hat:**
   - Copy: `/Users/ebbe/Desktop/STOCKHOLM/Streaks/Hattar/Gemini_Generated_Image_7du4w17du4w17du4-removebg-preview.png`
   - To: `/home/user/streaks/public/hats/hat-1.png`

## Adding More Hats

To add more hats to the shop:

1. **Add hat images** to `/home/user/streaks/public/hats/` with these names:
   - `hat-2.png` - Wizard Hat
   - `hat-3.png` - Crown
   - `hat-4.png` - Dragon Helmet
   - `hat-5.png` - Party Hat
   - `hat-6.png` - Top Hat

2. **Important:** Hat images should have:
   - Transparent background (PNG format)
   - Positioned to overlay on character's head
   - Similar size/proportions to hat-1

## After Adding Images

1. Rebuild the app:
   ```bash
   npm run build
   ```

2. The images will be included in the `dist` folder

## Current Shop Setup

The shop currently has 6 hats configured in `/home/user/streaks/src/data/hats.ts`:

| Hat ID | Name | Price | Rarity |
|--------|------|-------|--------|
| hat-1 | Classic Cap | 10 gold | Common |
| hat-2 | Wizard Hat | 50 gold | Rare |
| hat-3 | Crown | 100 gold | Epic |
| hat-4 | Dragon Helmet | 200 gold | Legendary |
| hat-5 | Party Hat | 30 gold | Common |
| hat-6 | Top Hat | 75 gold | Rare |

You can edit the prices, names, and rarities in `src/data/hats.ts` or add more hats!

## Testing

The app will use placeholder fallbacks if images are missing, so you can test the functionality before adding all images.
