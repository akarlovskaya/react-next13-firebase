// __mocks__/firebase/firestore.js
export const getFirestore = jest.fn(() => ({})); // Return an empty object as the mock db

export const doc = jest.fn((dbInstance, path, ...pathSegments) => ({
  _path: [path, ...pathSegments].join("/"),
}));

export const writeBatch = jest.fn((dbInstance) => ({
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  commit: jest.fn(), // This is crucial! We'll mock its resolution/rejection.
}));

export const increment = jest.fn((value) => ({ type: "INCREMENT", value }));
export const serverTimestamp = jest.fn(() => ({ type: "SERVER_TIMESTAMP" }));
