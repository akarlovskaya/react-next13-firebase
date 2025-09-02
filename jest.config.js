// jest.config.js
const nextJest = require("next/jest");

// createJestConfig is exported this way to ensure next/jest can load the Next.js config
const createJestConfig = nextJest({
  // Provides the path to Next.js app to load next.config.js and .env files
  dir: "./",
});

const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // For module mapping (e.g., styling)
  moduleNameMapping: {
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$": "jest-transform-stub",
    "^.+\\.(css|sass|scss|less)$": "identity-obj-proxy",
    "^firebase/auth$": "<rootDir>/__mocks__/firebase/auth.js",
    "^react-firebase-hooks/auth$":
      "<rootDir>/__mocks__/react-firebase-hooks/auth.js",
    "^react-hot-toast$": "<rootDir>/__mocks__/react-hot-toast.js",
    "^firebase/firestore$": "<rootDir>/__mocks__/firebase/firestore.js",
    "^../components/Loader.js$": "<rootDir>/__mocks__/components/Loader.js",
  },
  // To handle @/* imports if you use them in next.config.js
  //   moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jsdom",
  // Collect coverage from these files
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}", // For Next.js 13+ App Router
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
};

// createJestConfig is exported this way to ensure next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig);
