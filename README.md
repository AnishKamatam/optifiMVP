# OPTIFI MVP

A modern, intelligent ERP (Enterprise Resource Planning) system built with React and Supabase. OPTIFI transforms business operations through AI-driven automation, real-time analytics, and seamless integration across all departments.

## 🚀 Features

### Core ERP Modules
- **Finance Management**: Automated reconciliations, real-time cashflow tracking, AI-driven expense categorization
- **Operations**: Supply chain monitoring, predictive maintenance, smart task assignments
- **Human Resources**: Automated onboarding, time-off tracking, performance insights

### AI & Automation
- Intelligent automation that understands your business
- Predictive forecasting and analytics
- Custom AI model fine-tuning (Enterprise)
- Automated workflows and task assignments

### User Experience
- Modern, responsive design
- Interactive pricing with animated transitions
- Seamless authentication system
- Demo request functionality

## 🏗️ Architecture

### Frontend
- **React 19** with modern hooks and context API
- **Vite** for fast development and building
- **CSS Modules** for component styling
- **Responsive Design** optimized for all devices

### Backend & Database
- **Supabase** for authentication and database
- **PostgreSQL** database with real-time capabilities
- **Row Level Security (RLS)** for data protection
- **Edge Functions** for serverless backend logic

### Key Components
- `AuthContext`: Centralized authentication state management
- `AuthModal`: User registration and login interface
- `DemoRequestModal`: Demo request collection system
- `App.jsx`: Main application with pricing and features

## 📁 Project Structure

```
optifiMVP/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AuthModal.jsx   # Authentication modal
│   │   └── DemoRequestModal.jsx # Demo request form
│   ├── context/            # React context providers
│   │   └── AuthContext.jsx # Authentication context
│   ├── lib/                # External library configurations
│   │   └── supabase.js     # Supabase client setup
│   ├── assets/             # Images and static resources
│   ├── App.jsx             # Main application component
│   ├── App.css             # Main application styles
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── eslint.config.js        # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd optifiMVP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Ensure your Supabase project has the following tables:
   - `profiles`: User profile information
   - `demo_requests`: Demo request submissions

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 💰 Pricing Plans

### Free Tier
- Access to 1 ERP module (Finance OR Operations)
- Up to 3 seats
- Basic AI automations (10/month)
- 1 GB data storage
- Community support

### Starter Plan - $49/month
- Access to 3 ERP modules (Finance, Operations, HR)
- Up to 10 seats
- Unlimited basic AI automations
- 5 advanced automations/month
- 10 GB data storage

### Growth Plan - $199/month
- All ERP modules included
- Up to 25 seats
- Unlimited advanced automations
- Predictive forecasting & analytics
- 50 GB data storage
- Priority support

### Enterprise Plan - Custom Pricing
- Unlimited seats
- Custom AI model fine-tuning
- Dedicated account manager
- API & custom integrations
- On-premise or private cloud deployment
- SLA-backed uptime

## 🔧 Development

### Code Style
- ESLint configuration for consistent code quality
- React hooks best practices
- Component-based architecture
- Responsive design principles

### State Management
- React Context API for global state
- Local state for component-specific data
- Supabase real-time subscriptions

### Styling
- CSS modules for component isolation
- Responsive design with mobile-first approach
- Modern CSS features (Grid, Flexbox, Custom Properties)

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder to your hosting provider
3. Configure environment variables

## 🔒 Security

- Row Level Security (RLS) in Supabase
- Secure authentication with Supabase Auth
- Environment variable protection
- HTTPS enforcement in production

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

- **Demo Requests**: Use the demo request form on the website
- **Technical Issues**: Check the Supabase dashboard logs
- **Feature Requests**: Submit through the demo request form

## 🔮 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] API integrations (Salesforce, SAP, NetSuite)
- [ ] Multi-tenant architecture
- [ ] Advanced AI capabilities
- [ ] Internationalization support

---

Built with ❤️ using React, Vite, and Supabase
