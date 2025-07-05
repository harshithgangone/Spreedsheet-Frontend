# 🧮 Professional Spreadsheet Application

A modern, interactive spreadsheet app built with **React 18**, **TypeScript**, and **Tailwind CSS**, emulating the core functionalities of Google Sheets and Excel. Designed with pixel-perfect precision and professional UI/UX standards.

## 🚀 Live Demo

👉 [View the Live Application](https://spreedsheet-frontend.vercel.app/)

---

## 📌 Overview

This project was developed as part of a **React internship assignment** to build a pixel-perfect, fully functional spreadsheet UI based on a provided Figma design. It highlights advanced React concepts, strict TypeScript practices, and responsive, accessible design.

---

## 🎯 Features

### ✅ Core Interface
- Pixel-perfect layout replicating spreadsheet tools
- Fully interactive grid with cell-level interactivity
- Sticky headers, row highlights & empty rows
- Responsive design for all devices
- Clean animations and transitions

### 🧰 Toolbar Functionalities
- **Hide Fields** – Toggle column visibility
- **Sort** – Multi-column sorting with visual cues
- **Filter** – Advanced filtering for data refinement
- **View Mode** – Grid and list toggle
- **Import/Export** – Simulated file operations
- **Share** – UI for collaboration

### 📊 Data Features
- Status indicators (Complete, In-process, Blocked, etc.)
- Priority tags (High, Medium, Low)
- Date and currency formatting
- URL validation and external link handling

---

## 🛠️ Tech Stack

- ⚛️ **React 18**
- 🧑‍💻 **TypeScript (Strict Mode)**
- 🎨 **Tailwind CSS**
- ⚡ **Next.js 14** (App Router)
- 🧱 **Radix UI** – Accessible components
- 🖼️ **Lucide React** – Clean and customizable icons

---

## 📁 Folder Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind setup
│   ├── layout.tsx           # Root layout file
│   └── page.tsx             # Main page component
├── components/
│   ├── ui/                  # Reusable UI elements (button, badge, etc.)
│   ├── spreadsheet-header.tsx
│   ├── spreadsheet-toolbar.tsx
│   ├── spreadsheet-grid.tsx
│   └── spreadsheet-tabs.tsx
├── lib/
│   ├── utils.ts             # Utility functions
│   └── mock-data.ts         # Sample/mock dataset
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/spreadsheet-app.git
cd spreadsheet-app
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start
```

---

## 🧪 Code Quality & Tooling

```bash
# Linting
npm run lint

# Type Checking
npm run type-check

# Prettier Formatting
npm run format
```

- TypeScript strict mode enabled
- Interface-based design for clarity and maintainability

---

## 🎨 Design System

### 🎨 Color Palette
- ✅ Green – Success, Complete
- 🟡 Yellow – In Process
- 🔴 Red – Blocked, High Priority
- 🔵 Blue – Low Priority
- ⚫ Gray – Not Started

### 🅰️ Typography
- Font: **Inter**
- Consistent sizing & weights
- High contrast for readability

### 🌀 Animations
- Smooth hover transitions
- Fade-ins for dynamic content
- Scale effects on interactivity

---

## 📱 Responsive Layouts

- 📱 **Mobile** (320px–767px): Clean, compact UI
- 💻 **Tablet** (768px–1199px): Touch-friendly features
- 🖥️ **Desktop** (1200px+): Full-fledged functionality

---

## 🔧 Customization Guide

### ➕ Add Columns
1. Update `JobRequest` in `lib/mock-data.ts`
2. Define column in `spreadsheet-grid.tsx`
3. Update logic in sorting/filtering if needed

### 🎨 Style Changes
- Tailwind colors: `tailwind.config.ts`
- Reusable UI: `components/ui/`
- Global styles: `app/globals.css`

---

## 🚀 Deployment

### ▶️ Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms
- Netlify
- Railway
- AWS Amplify
- Heroku

---

## ⚠️ Known Limitations

| Feature                | Status        | Notes                                 |
|------------------------|---------------|----------------------------------------|
| Data Persistence       | ❌ Not enabled | Currently uses mock data only         |
| Real-time Collaboration| ❌ Missing     | No WebSocket/Live sync implemented    |
| Advanced Excel Features| ❌ Not included| No formulas, macros, or charts yet    |
| Virtual Scrolling      | ❌ Pending     | Performance may drop on large datasets|

---

## 🤝 Contribution Guide

```bash
# Fork this repo
# Create your branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push and open a PR
git push origin feature/amazing-feature
```

---

## 📄 License

Licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for full details.

---

## 👤 Author

**Your Name**  
[GitHub](https://github.com/harshithgangone) · [LinkedIn](https://www.linkedin.com/in/harshith-gangone/) · 📧 your.email@example.com

---

## 🙌 Acknowledgments

- Inspired by **Google Sheets** & **Microsoft Excel**
- Icons from [Lucide.dev](https://lucide.dev)
- Components by [Radix UI](https://radix-ui.com)
- Styling via [Tailwind CSS](https://tailwindcss.com)

---

**Made with ❤️ as part of a React Internship Challenge**
