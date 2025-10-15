import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { createContext, useState } from "react";
import { db } from "../firebaseConfig";

export const accountContext = createContext();

export function AccountProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("");

  // 🔹 Login
  async function fetchAccount({ username, password }) {
    const q = query(
      collection(db, "Account"),
      where("username", "==", username),
      where("password", "==", password)
    );
    const verify = await getDocs(q);
    if (!verify.empty) {
      setCurrentUser(username);
      return true;
    }
    return false;
  }

  // 🔹 Logout
  async function logout() {
    setCurrentUser(null);
  }

  // 🔹 Create new account
  async function createAccount(accountData) {
    const check = query(
      collection(db, "Account"),
      where("username", "==", accountData.username)
    );
    const existing = await getDocs(check);
    if (!existing.empty) return false;

    await addDoc(collection(db, "Account"), accountData);
    setCurrentUser(accountData.username);
    return true;
  }

  // 🔹 Update username
  async function updateAccount({ oldUsername, newUsername, password }) {
    const q = query(
      collection(db, "Account"),
      where("username", "==", oldUsername),
      where("password", "==", password)
    );
    const snap = await getDocs(q);

    if (snap.empty) return { success: false, message: "Incorrect password" };

    const userDoc = snap.docs[0];
    await updateDoc(userDoc.ref, { username: newUsername });
    setCurrentUser(newUsername);
    return { success: true, message: "Username updated successfully" };
  }

  // 🔹 Change password
  async function changePassword({ username, currentPassword, newPassword }) {
    const q = query(
      collection(db, "Account"),
      where("username", "==", username),
      where("password", "==", currentPassword)
    );
    const snap = await getDocs(q);

    if (snap.empty) return { success: false, message: "Incorrect current password" };

    const userDoc = snap.docs[0];
    await updateDoc(userDoc.ref, { password: newPassword });
    return { success: true, message: "Password updated successfully" };
  }

  // 🔹 Delete account (password verification)
  async function deleteAccount({ username, password }) {
    const q = query(
      collection(db, "Account"),
      where("username", "==", username),
      where("password", "==", password)
    );
    const snap = await getDocs(q);

    if (snap.empty) return { success: false, message: "Incorrect password" };

    const userDoc = snap.docs[0];
    await deleteDoc(userDoc.ref);
    setCurrentUser(null);
    return { success: true, message: "Account deleted successfully" };
  }

  return (
    <accountContext.Provider
      value={{
        currentUser,
        fetchAccount,
        logout,
        createAccount,
        updateAccount,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </accountContext.Provider>
  );
}
