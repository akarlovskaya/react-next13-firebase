"use client";
import { useState } from "react";
import DeleteUserAccount from "../lib/user-management.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "../components/Loader.js";

function DeleteAccountButton({ disabled }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeleteRequest = () => {
    setShowConfirmDialog(true);
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
            onClick={handleDeleteRequest}
            disabled={disabled}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
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
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default DeleteAccountButton;
