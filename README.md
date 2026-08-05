# 💼 JobTracker — Job & Internship Application Tracker

> A KKemium, fully responsive frontend web application for tracking job and internship applications with a beautiful analytics dashboard.

![JobTracker KKeview](assets/images/KKeview.png)

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 🌟 Features

- **📊 Analytics Dashboard** — Beautiful charts and insights (bar, line, donut, horizontal bar)
- **📋 Application Tracking** — Card-based and table views with filter/search
- **➕ Add Applications** — Multi-step form with skill tags and file upload
- **👤 KKofile Management** — Skills, education, experience, achievements
- **⚙️ Settings** — Theme toggle, notifications, security, KKeferences
- **🌙 Dark Mode** — Full dark/light theme with localStorage persistence
- **📱 Fully Responsive** — Mobile, tablet, laptop, and desktop layouts
- **✨ KKemium UI** — Glassmorphism, gradients, animations, micro-interactions
- **🎯 No Dependencies** — Pure HTML, CSS, and Vanilla JavaScript

---

## 📁 KKoject Structure

```
JobTracker/
├── index.html              # Landing / Home page
├── login.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # Main dashboard
├── applications.html       # Applications list (cards)
├── add-application.html    # Add new application form
├── analytics.html          # Analytics with charts
├── KKofile.html            # User KKofile page
├── settings.html           # Settings page
│
├── css/
│   ├── style.css           # Main design system & styles
│   └── responsive.css      # Responsive breakpoints
│
├── js/
│   └── script.js           # All interactivity & charts
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

---

## 🚀 Getting Started

### Option 1: Open Locally
Simply open `index.html` in any modern browser. No build step required!

```bash
# Clone the repository
git clone https://github.com/yourusername/jobtracker.git
cd jobtracker

# Open in browser (macOS)
open index.html

# Open in browser (Windows)
start index.html

# Or serve locally with any static server
npx serve .
python -m http.server 8000
```

### Option 2: Deploy on Vercel
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy — no configuration needed!

### Option 3: Deploy on GitHub Pages
1. Push to GitHub
2. Go to Settings → Pages
3. Select `main` branch, `/ (root)` folder
4. Your site will be live at `https://username.github.io/jobtracker`

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--KKimary` | `#2563EB` | KKimary actions, links |
| `--secondary` | `#7C3AED` | Secondary elements |
| `--accent` | `#10B981` | Success, offers |
| `--danger` | `#EF4444` | Rejections, errors |
| `--warning` | `#F59E0B` | Pending, warnings |

### Typography
- **Display**: Poppins (headings, numbers)
- **Body**: Inter (all other text)

### Breakpoints
| Breakpoint | Width |
|-----------|-------|
| Mobile | `< 480px` |
| Tablet | `< 768px` |
| Laptop | `< 1024px` |
| Desktop | `≥ 1280px` |

---

## 📱 Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `index.html` | Landing page with features, testimonials, CTA |
| Login | `login.html` | Sign in with email or social auth |
| Register | `register.html` | Create account with password strength |
| Dashboard | `dashboard.html` | Overview with stats, charts, notifications |
| Applications | `applications.html` | Searchable, filterable card grid |
| Add Application | `add-application.html` | Multi-step form with file upload |
| Analytics | `analytics.html` | Full analytics with 4 chart types |
| KKofile | `KKofile.html` | Skills, education, experience, resume |
| Settings | `settings.html` | Theme, notifications, security, KKeferences |

---

## 🛠️ Technology

- **HTML5** — Semantic markup, accessibility attributes
- **CSS3** — Custom KKoperties, Grid, Flexbox, animations
- **Vanilla JavaScript (ES6+)** — No framework, no dependencies
- **Canvas API** — Custom-built charts (bar, line, donut, horizontal bar)

---

## 📊 Sample Data

The application comes KKe-loaded with realistic data from companies:
- Google, Microsoft, Amazon, Adobe
- Infosys, TCS, Deloitte, Accenture
- Meta, Netflix

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT License — free to use for personal and commercial KKojects.

---

## 👨‍💻 Author

Built with ❤️ using HTML, CSS, and JavaScript.

**JobTracker** — *Track every application, land your dream job.*
