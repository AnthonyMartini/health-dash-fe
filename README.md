# Next Step Tracker - Health Dashboard

A comprehensive health tracking application built with React, Vite, and AWS Amplify. Track your daily health metrics, nutrition, and workout plans in one place.

## Features

- **Health Metrics Tracking**: Monitor calories, steps, sleep, water intake, and weight
- **Nutrition Logging**: Track meals and view macro breakdowns
- **Workout Planning**: Create and log workout routines
- **Real-time Updates**: Instant feedback on your progress
- **Responsive Design**: Works seamlessly across all devices

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- AWS CLI (if you plan to use AWS services)
- AWS Amplify CLI (if you plan to use AWS services)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd health-dash-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_APP_API_URL=your-api-url
   VITE_APP_REGION=your-aws-region
   VITE_APP_USER_POOL_ID=your-user-pool-id
   VITE_APP_USER_POOL_CLIENT_ID=your-client-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:5173` to see the application running.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
health-dash-fe/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Application pages
│   ├── utils/         # Utility functions and types
│   └── assets/        # Static assets
├── public/            # Public assets
└── amplify/           # AWS Amplify configuration
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the repository or contact [your-email@example.com].