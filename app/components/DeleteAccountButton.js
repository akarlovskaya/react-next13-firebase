"use client";
import { useState, useContext } from "react";
import DeleteUserAccount from "../lib/user-management.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "../components/Loader.js";
import {
  GoogleAuthProvider,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

function DeleteAccountButton({ disabled, user }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // to do (auth/popup-closed-by-user).

  const handleDeleteRequest = async (user) => {
    const isGoogleUser = user.providerData.some(
      (provider) => provider.providerId === "google.com"
    );

    try {
      if (isGoogleUser) {
        // Re-authenticate with Google
        const provider = new GoogleAuthProvider();
        setLoading(true);
        await reauthenticateWithPopup(user, provider);
        // Now delete the user
        await user.delete();

        toast.success("Your account has been deleted successfully.");
        console.log("Now user deleted");
        setLoading(false);
        // Redirect to home page or login
        router.push("/");
      } else {
        setShowConfirmDialog(true);
      }
    } catch (error) {
      toast.error("Failed to delete account");
      setError(`An unexpected error occurred ${error.message}`);
      console.error("Error deleting user:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setPassword("");
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    setError("");

    try {
      const result = await DeleteUserAccount(password);
      setLoading(true);
      if (result.success) {
        toast.success("Your account has been deleted successfully.");
        // Redirect to home page or login
        router.push("/");
      } else {
        setError(result.error || "Failed to delete account");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner show={loading} />
        </div>
      ) : (
        <>
          <button
            onClick={() => handleDeleteRequest(user)}
            disabled={disabled}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 mt-8 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>

          {showConfirmDialog && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Delete Account</h3>
                <p className="mb-4">
                  This action cannot be undone. Please enter your password to
                  confirm.
                </p>

                <form onSubmit={handleConfirmDelete}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  {error && <div className="text-red-600 mb-4">{error}</div>}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleCancelDelete()}
                      className="border rounded px-4 py-2"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete My Account"}
                    </button>
                  </div>
                </form>
                <div className="text-sm text-gray-700 mt-8 text-center">
                  Troubles deleting account? Contact support@vanklas.com{" "}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default DeleteAccountButton;
