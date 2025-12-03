# Student Talent Hub Mobile App

A React Native mobile application for the Student Talent Hub platform, built with Expo and TypeScript.

## Features

- **Authentication**: Login and registration for students and businesses
- **Job Listings**: Browse and search for job opportunities
- **Applications**: Track job applications (for students)
- **Messaging**: Real-time messaging between users
- **Profile Management**: Complete profile management for students and businesses
- **Business Dashboard**: Post jobs and manage applications (for businesses)

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **Axios** for API communication
- **AsyncStorage** for local data persistence
- **Expo Linear Gradient** for UI enhancements
- **Ionicons** for icons

## Project Structure

```
StudentTalentHubMobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── jobs/          # Job-related screens
│   │   ├── profile/       # Profile screens
│   │   ├── messages/      # Messaging screens
│   │   ├── applications/  # Application screens
│   │   └── business/      # Business-specific screens
│   ├── services/          # API services
│   ├── store/             # Redux store and slices
│   │   └── slices/        # Redux slices
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── navigation/        # Navigation configuration
├── App.tsx                # Main app component
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StudentTalentHubMobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Configuration

### API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url:3000/api';
```

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:3000/api
```

## Development

### Adding New Screens

1. Create a new screen component in the appropriate directory under `src/screens/`
2. Add the screen to the navigation in `src/navigation/index.tsx`
3. Update the types in `src/types/index.ts` if needed

### Adding New API Endpoints

1. Add the method to `src/services/api.ts`
2. Create a Redux slice if needed in `src/store/slices/`
3. Use the new API method in your components

### State Management

The app uses Redux Toolkit for state management with the following slices:

- **authSlice**: Authentication state
- **jobsSlice**: Job listings and applications
- **studentsSlice**: Student profile data
- **businessesSlice**: Business profile data
- **messagesSlice**: Messaging functionality
- **adminSlice**: Admin functionality

## Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## Testing

```bash
npm test
```

## Deployment

### Expo Application Services (EAS)

1. Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for production:
```bash
eas build --platform all
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
