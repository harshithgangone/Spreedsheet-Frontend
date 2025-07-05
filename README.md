# Professional Spreadsheet Application

A modern, interactive spreadsheet application built with React 18, TypeScript, and Tailwind CSS. This project replicates the functionality and design of professional spreadsheet tools like Google Sheets and Excel.

## 🚀 Live Demo

[View Live Application](https://your-deployment-url.vercel.app)

## 📋 Project Overview

This application was built as part of a React internship assignment to create a pixel-perfect, fully functional spreadsheet interface. The project demonstrates advanced React patterns, TypeScript implementation, and modern UI/UX design principles.

### Key Features

- ✅ **Pixel-perfect design** matching the provided Figma specifications
- ✅ **Google Sheets/Excel-like experience** with interactive cells and grid
- ✅ **Fully functional buttons** - no dead UI elements
- ✅ **Responsive design** that works across all device sizes
- ✅ **Modern animations** and smooth transitions
- ✅ **TypeScript strict mode** for type safety
- ✅ **Professional styling** with Tailwind CSS

## 🛠️ Tech Stack

- **React 18** - Latest React with hooks and modern patterns
- **TypeScript** - Strict mode enabled for type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Next.js 14** - App Router for modern React development
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful, customizable icons

## 🎯 Core Functionality

### Interactive Spreadsheet Features
- **Sortable columns** with visual indicators (ascending/descending)
- **Row selection** with checkboxes and bulk operations
- **Cell hover effects** and interactive states
- **Sticky headers** that remain visible during scrolling
- **Alternating row colors** for better readability
- **Empty rows** for authentic spreadsheet experience

### Toolbar Operations
- **Hide Fields** - Toggle column visibility
- **Sort** - Multi-column sorting capabilities
- **Filter** - Advanced data filtering options
- **Cell View** - Switch between grid and list views
- **Import/Export** - Data import and export functionality
- **Share** - Collaboration and sharing features

### Data Management
- **Status tracking** with color-coded badges
- **Priority indicators** (High, Medium, Low)
- **Date formatting** and validation
- **Currency formatting** for financial data
- **URL validation** with external link handling

## 📁 Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main application page
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── checkbox.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   └── avatar.tsx
│   ├── spreadsheet-header.tsx    # Top navigation and user info
│   ├── spreadsheet-toolbar.tsx   # Action buttons and tools
│   ├── spreadsheet-grid.tsx      # Main data grid component
│   └── spreadsheet-tabs.tsx      # Bottom tab navigation
├── lib/
│   ├── utils.ts             # Utility functions
│   └── mock-data.ts         # Sample data for demonstration
└── README.md
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/spreadsheet-app.git
   cd spreadsheet-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🧪 Code Quality

This project maintains high code quality standards:

### Linting and Formatting
\`\`\`bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run type-check

# Format code with Prettier
npm run format
\`\`\`

### Type Safety
- **TypeScript strict mode** enabled
- **Comprehensive type definitions** for all components
- **Interface-driven development** for better maintainability

## 🎨 Design System

### Color Palette
- **Primary Green**: Used for active states and selections
- **Status Colors**: 
  - 🟡 Yellow for "In-process"
  - 🔴 Red for "Blocked" and "High" priority
  - 🟢 Green for "Complete"
  - 🔵 Blue for "Low" priority
  - ⚫ Gray for "Need to start"

### Typography
- **Inter font family** for modern, readable text
- **Consistent sizing** using Tailwind's type scale
- **Proper contrast ratios** for accessibility

### Animations
- **Smooth hover transitions** (200ms duration)
- **Fade-in effects** for dynamic content
- **Subtle scale transforms** for interactive elements

## 📱 Responsive Design

The application is fully responsive across all device sizes:

- **Desktop** (1200px+): Full feature set with optimal spacing
- **Tablet** (768px - 1199px): Adapted layout with touch-friendly controls
- **Mobile** (320px - 767px): Simplified interface with essential features

## 🔧 Customization

### Adding New Columns
1. Update the `JobRequest` interface in `lib/mock-data.ts`
2. Add column definition in `spreadsheet-grid.tsx`
3. Update sorting and filtering logic as needed

### Styling Modifications
- Colors can be customized in `tailwind.config.ts`
- Component styles are in individual component files
- Global styles are in `app/globals.css`

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Heroku

## 🐛 Known Issues & Trade-offs

### Current Limitations
- **Data persistence**: Currently uses mock data (can be connected to a database)
- **Real-time collaboration**: Not implemented (would require WebSocket integration)
- **Advanced Excel features**: Complex formulas and charts not included

### Performance Considerations
- **Virtual scrolling**: Not implemented for very large datasets (1000+ rows)
- **Memoization**: Could be added for better performance with frequent re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Design inspiration from Google Sheets and Microsoft Excel
- Icons provided by [Lucide React](https://lucide.dev)
- UI components built with [Radix UI](https://radix-ui.com)
- Styling powered by [Tailwind CSS](https://tailwindcss.com)

---

**Built with ❤️ for the React Internship Assignment**
