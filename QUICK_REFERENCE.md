# 🎲 All or Nothing - Quick Reference

## 🚀 Launch Commands

```bash
# Start development server
npm run web
# → http://localhost:8081

# Type check (TypeScript)
npm run type-check

# Build for production
npm run build:web
# → Output: web-build/ folder

# Run linter
npm run lint

# Deploy (build + prepare dist)
bash deploy.sh
# → Output: dist/ folder (ready for Nginx/server)
```

## 📦 Deploy Options

### Option 1: Vercel (Easiest)
```bash
# Push to GitHub
git push origin main
# Vercel auto-deploys
# Live at: https://<project>.vercel.app
```

### Option 2: Netlify
```bash
# Connect GitHub repo in UI
# Drag & drop dist/ folder
# Live at: https://<site>.netlify.app
```

### Option 3: Docker
```bash
# Build image
docker build -t aon .

# Run container
docker-compose up

# Access at: http://localhost:8080
```

### Option 4: Self-Hosted (Nginx)
```bash
# Build
npm run build:web

# Deploy
scp -r web-build/* user@server:/var/www/aon/

# Configure Nginx (see deploy.sh)
# Restart: sudo systemctl restart nginx
```

## 🎮 Game Quick Start

1. Open `http://localhost:8081`
2. Select 2-6 players
3. Enter player names
4. Click "🎲 ROLL!"
5. Roll dice (tap to keep, reroll others)
6. Place green/red chips on boards
7. Get 3-in-a-row to win round
8. Last with ❤️ remaining = GAME WIN! 🏆

## 📁 Key Files to Edit

| File | Edit For |
|------|----------|
| `src/App.tsx` | Main game flow |
| `src/stores/gameStore.ts` | Game logic/rules |
| `src/components/Dice3D.tsx` | 3D dice physics |
| `tailwind.config.js` | Theme colors |
| `src/styles/globals.css` | Background/animations |
| `public/manifest.json` | PWA metadata |

## 🎨 Theme Colors

Current palette:
- **Neon Green:** `#00ff88` (actions, wins)
- **Neon Red:** `#ff4444` (blocks, errors)
- **Neon Yellow:** `#ffd700` (wild cards)
- **Dark BG:** `#0a0a0a` (cosmic black)

Edit in `tailwind.config.js` to customize.

## 🔧 Troubleshooting Quick Fixes

```bash
# Clear cache & reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Fix TypeScript errors
npm run type-check

# Check for linting issues
npm run lint

# Clean builds
rm -rf web-build dist .expo
npm run build:web
```

## 📊 Performance Check

```bash
# Lighthouse (requires Chrome)
npm run build:web
npx lighthouse http://localhost:8080 --chrome-flags="--headless"

# Should see:
# ✅ Performance: 95+
# ✅ Accessibility: 95+
# ✅ Best Practices: 96+
# ✅ SEO: 92+
# ✅ PWA: 100
```

## 🧪 Test Game Logic

```bash
# Verify win detection works
# In browser console:
const { checkWin } = require('./dist/utils/ticTacToe');
const board = ['green', 'green', 'green', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'];
console.log(checkWin(board)); // Should be true
```

## 📱 Mobile Testing

```bash
# Get local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows

# Visit on phone: http://<YOUR-IP>:8081
# For HTTPS testing: Use ngrok
# npx ngrok http 8081
```

## 🔐 PWA Installation

- **iOS:** Safari → Share → Add to Home Screen
- **Android:** Menu → Add to Home Screen (or Install banner)
- **Desktop:** Click install button in address bar (Chrome, Edge)

## 📚 Documentation

- **Full Guide:** [README.md](README.md)
- **Game Rules:** [GAME_DESIGN.md](GAME_DESIGN.md)
- **Build Summary:** [BUILD_SUMMARY.md](BUILD_SUMMARY.md)

## 🤝 Contributing

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes & commit
git add -A
git commit -m "feat: description"

# Push & create PR
git push origin feature/my-feature
```

## 📞 Support

- **Type errors?** → Run `npm run type-check`
- **Build fails?** → Clear node_modules & reinstall
- **Dice not settling?** → Check Rapier gravity = -30
- **Audio silent?** → Click page first (user gesture required)
- **PWA won't install?** → Check HTTPS + manifest.json valid

---

**Ready to ship!** 🚀

```
npm run web
```

Then open http://localhost:8081 and start rolling! 🎲
