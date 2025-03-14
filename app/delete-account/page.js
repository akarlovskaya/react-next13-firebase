"use client";
import { useState } from "react";
import DeleteAccountButton from "../components/DeleteAccountButton.js";
import AuthCheck from "../components/AuthCheck";

const DeleteAccountPage = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <>
      <main className="p-8 min-h-screen">
        <AuthCheck>
          <h1 className="text-2xl font-bold mb-4">Delete Account</h1>
          <p className="text-red-600 mb-4">
            Warning: This action is irreversible. All your profile and classes
            data will be permanently deleted.
          </p>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mr-2"
              />
              <span>I understand and want to delete my account.</span>
            </label>
            <DeleteAccountButton disabled={!isConfirmed} />
          </div>
        </AuthCheck>
      </main>
    </>
  );
};

export default DeleteAccountPage;
