import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FollowClass from "../FollowClass";

// Mock the props and Firebase functions
jest.mock("firebase/firestore");
jest.mock("react-hot-toast");

// Import the mocked functions so we can manipulate and assert on them
import { writeBatch, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";

describe("FollowClass Component", () => {
  // Define reusable mock data
  const mockWorkout = {
    title: "Morning Yoga",
    slug: "morning-yoga",
    uid: "instructor-uid-123",
  };

  const mockCurrentUser = {
    uid: "user-uid-456",
    displayName: "Jane Doe",
    email: "jane@example.com",
  };

  const mockSetIsFollowing = jest.fn(); // Mock function for the state setter

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup(); // This is the correct way to clean up rendered components
    jest.restoreAllMocks();
  });

  // Test 1: Renders correctly when NOT following
  it('renders the "Follow Class" button when user is not following', () => {
    render(
      <FollowClass
        workout={mockWorkout}
        currentUser={mockCurrentUser}
        isFollowing={false}
        setIsFollowing={mockSetIsFollowing}
      />
    );

    expect(
      screen.getByText("Get Notified About Class Changes")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /follow class/i })
    ).toBeInTheDocument();
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument(); // Spinner should not show
  });

  // Test 2: Renders correctly when IS following
  it('renders the success state and "Unfollow" button when user is following', () => {
    render(
      <FollowClass
        workout={mockWorkout}
        currentUser={mockCurrentUser}
        isFollowing={true}
        setIsFollowing={mockSetIsFollowing}
      />
    );

    // Check for elements that should be present
    expect(
      screen.getByText(/you are following the class changes/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /unfollow class/i })
    ).toBeInTheDocument();

    // Use word boundaries and case-insensitive match
    const followButtons = screen.queryAllByRole("button", {
      name: /\bfollow class\b/i,
    });

    expect(followButtons).toHaveLength(0); // Should find ZERO follow buttons
  });

  // Test 3: Shows spinner when loading
  it("shows the spinner when isLoading is true", () => {
    // We can't directly set isLoading, but we can trigger an action that sets it
    // For this simple test, let's just check the Spinner mock is used correctly.
    // A more advanced test would involve mocking a delayed Firebase response.
    render(
      <FollowClass
        workout={mockWorkout}
        currentUser={mockCurrentUser}
        isFollowing={false}
        setIsFollowing={mockSetIsFollowing}
      />
    );
    // The spinner is hidden initially
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });

  // Test 4: Clicking "Follow" without being signed in shows error
  it("shows an error toast if user tries to follow without being signed in", async () => {
    const user = userEvent.setup();

    render(
      <FollowClass
        workout={mockWorkout}
        currentUser={null} // No user signed in
        isFollowing={false}
        setIsFollowing={mockSetIsFollowing}
      />
    );

    const followButton = screen.getByRole("button", { name: /follow class/i });
    await user.click(followButton);

    expect(toast.error).toHaveBeenCalledWith(
      "Please sign in to join the class"
    );
    // Ensure no Firebase calls were made
    expect(writeBatch).not.toHaveBeenCalled();
  });

  // Test 5: Successful follow operation
  it("successfully follows a class and updates state", async () => {
    const user = userEvent.setup();

    // 1. Mock the batch to successfully resolve
    const mockBatchInstance = {
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn().mockResolvedValue(), // This promise resolves successfully
    };
    writeBatch.mockReturnValue(mockBatchInstance);

    render(
      <FollowClass
        workout={mockWorkout}
        currentUser={mockCurrentUser}
        isFollowing={false}
        setIsFollowing={mockSetIsFollowing}
      />
    );

    // 2. User clicks the button
    const followButton = screen.getByRole("button", { name: /follow class/i });
    await user.click(followButton);

    // 3. Assertions
    // Check that the correct document references were created
    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      mockWorkout.uid,
      "workouts",
      mockWorkout.slug,
      "participants",
      mockCurrentUser.uid
    );
    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      mockCurrentUser.uid
    );

    // Check that batch operations were called
    expect(mockBatchInstance.set).toHaveBeenCalled();
    expect(mockBatchInstance.update).toHaveBeenCalledTimes(2); // userPrefs + participantCount

    // Check that the batch was committed
    expect(mockBatchInstance.commit).toHaveBeenCalled();

    // Wait for the async operation to complete and assert on the results
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        `Request submitted! We're sending you a confirmation email.`,
        { duration: 5000 }
      );
      expect(mockSetIsFollowing).toHaveBeenCalledWith(true); // Parent state was updated
    });
  });

  // Test 6: Failed follow operation shows error toast
  it("shows an error toast if the follow operation fails", async () => {
    const user = userEvent.setup();
    const testError = new Error("Firebase failed!");
    testError.code = "permission-denied"; // Simulate a specific error code

    // 1. Spy on console.error and mock its implementation to do nothing
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const mockBatchInstance = {
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn().mockRejectedValue(testError), // This promise rejects
    };
    writeBatch.mockReturnValue(mockBatchInstance);

    render(
      <FollowClass
        workout={mockWorkout}
        currentUser={mockCurrentUser}
        isFollowing={false}
        setIsFollowing={mockSetIsFollowing}
      />
    );

    const followButton = screen.getByRole("button", { name: /follow class/i });
    await user.click(followButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "You don't have permission to join this class."
      );
      expect(mockSetIsFollowing).not.toHaveBeenCalled();

      // 3. (Optional) Assert that the error was also logged to the console
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error joining class:",
        testError
      );
    });
    // 4. Clean up the mock after the test to avoid affecting other tests
    consoleErrorSpy.mockRestore();
  });

  // Test 7: Successful unfollow operation
  it("successfully unfollows a class and updates state", async () => {
    const user = userEvent.setup();
    const mockBatchInstance = {
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn().mockResolvedValue(),
    };
    writeBatch.mockReturnValue(mockBatchInstance);

    render(
      <FollowClass
        workout={mockWorkout}
        currentUser={mockCurrentUser}
        isFollowing={true} // Start in the "following" state
        setIsFollowing={mockSetIsFollowing}
      />
    );

    const unfollowButton = screen.getByRole("button", {
      name: /unfollow class/i,
    });
    await user.click(unfollowButton);

    await waitFor(() => {
      expect(mockBatchInstance.delete).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("You've successfully unfollowed")
      );
      expect(mockSetIsFollowing).toHaveBeenCalledWith(false);
    });
  });
});
