Testing Guide:
Overview
This guide covers the test configuration and practices for our React/Next.js application with Firebase integration. We use Jest and React Testing Library for a modern, user-centric testing approach.

Prerequisites
Node.js (v18 or higher)

npm or yarn

Installation
The testing stack is already installed. Key devDependencies include:

json
{
"devDependencies": {
"jest": "^29.0.0",
"jest-environment-jsdom": "^29.0.0",
"@testing-library/react": "^13.0.0",
"@testing-library/jest-dom": "^6.0.0",
"@testing-library/user-event": "^14.0.0",
"babel-jest": "^29.0.0",
"jest-transform-stub": "^2.0.0"
}
}
Configuration Files
Jest Config (jest.config.js)
Located in the project root, this file configures Jest to work with Next.js and defines module mappings for mocks.

javascript
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
moduleNameMapping: {
'^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': 'jest-transform-stub',
    '^.+\\.(css|sass|scss|less)$': 'identity-obj-proxy',
'^firebase/auth$': '<rootDir>/__mocks__/firebase/auth.js',
    '^firebase/firestore$': '<rootDir>/**mocks**/firebase/firestore.js',
'^react-firebase-hooks/auth$': '<rootDir>/__mocks__/react-firebase-hooks/auth.js',
    '^react-hot-toast$': '<rootDir>/**mocks**/react-hot-toast.js',
'^../components/Loader.js$': '<rootDir>/**mocks**/components/Loader.js',
},
moduleDirectories: ['node_modules', '<rootDir>/'],
testEnvironment: 'jsdom',
collectCoverageFrom: [
'app/**/*.{js,jsx,ts,tsx}',
'pages/**/*.{js,jsx,ts,tsx}',
'!**/*.d.ts',
'!**/node_modules/**',
'!**/.next/**',
],
};

module.exports = createJestConfig(customJestConfig);
Global Test Setup (jest.setup.js)
Imports custom Jest DOM matchers for better assertions.

javascript
import '@testing-library/jest-dom';
Available Scripts
Command Description
npm test Run tests in watch mode (development)
npm run test:ci Run tests once with coverage (CI/CD)
npm run test:coverage Run tests with coverage report (watch mode)
Mocking Strategy
All mocks are located in the **mocks**/ directory at the project root.

Firebase Mocks
**mocks**/firebase/auth.js - Mocks authentication functions

**mocks**/firebase/firestore.js - Mocks Firestore operations

Library Mocks
**mocks**/react-firebase-hooks/auth.js - Mocks useAuthState hook

**mocks**/react-hot-toast.js - Mocks toast notifications

**mocks**/components/Loader.js - Mocks the Spinner component

Test Structure
We use the co-located approach where tests live next to the code they test:

text
components/
FollowClass/
FollowClass.js # Component
**tests**/
FollowClass.test.js # Tests
Writing Tests
Basic Test Template
javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from '../Component';

// Mock external dependencies
jest.mock('firebase/firestore');
jest.mock('react-hot-toast');

describe('Component Name', () => {
const mockData = { /_ test data _/ };
const mockFunction = jest.fn();

beforeEach(() => {
jest.clearAllMocks();
});

it('renders correctly', () => {
render(<Component prop={value} />);
expect(screen.getByText('Expected text')).toBeInTheDocument();
});

it('handles user interactions', async () => {
const user = userEvent.setup();
render(<Component prop={value} />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockFunction).toHaveBeenCalled();
    });

});
});
Testing Firebase Components
When testing components with Firebase interactions:

Mock all Firebase imports

Mock batch operations and their responses

Test both success and error cases

javascript
// Mock batch operation
const mockBatchInstance = {
set: jest.fn(),
update: jest.fn(),
delete: jest.fn(),
commit: jest.fn().mockResolvedValue(), // or .mockRejectedValue()
};
writeBatch.mockReturnValue(mockBatchInstance);
Best Practices
Use descriptive test names that explain the expected behavior

Mock all external dependencies (Firebase, APIs, libraries)

Test user flows not implementation details

Use userEvent over fireEvent for more realistic interactions

Handle async operations with waitFor and proper assertions

Clean up mocks between tests using beforeEach(jest.clearAllMocks)

CI/CD Integration
The project is configured to run tests on Vercel deployments. The build command in Vercel settings is:

text
npm run test:ci && next build
This ensures tests must pass before deployment.

Coverage Reports
Run npm run test:coverage to generate coverage reports. The report will be available at:
/coverage/lcov-report/index.html

Common Issues & Solutions
Firebase Functions Called with Undefined
Ensure your Firebase mocks account for the first dbInstance parameter:

javascript
// In **mocks**/firebase/firestore.js
export const doc = jest.fn((dbInstance, path, ...pathSegments) => ({
\_path: [path, ...pathSegments].join('/'),
}));
Console Error Output in Tests
Suppress expected console errors in tests:

javascript
it('handles errors', async () => {
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Test code that triggers console.error

expect(consoleErrorSpy).toHaveBeenCalledWith('Expected error');
consoleErrorSpy.mockRestore();
});
Regex Matching Unexpected Elements
Use word boundaries for precise text matching:

javascript
// Instead of:
screen.getByRole('button', { name: /follow class/i });

// Use:
screen.getByRole('button', { name: /\bfollow class\b/i });
