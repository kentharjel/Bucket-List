// contexts/accountContext.js
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { createContext, useState } from "react";
import { db } from "../firebaseConfig";

export const accountContext = createContext();

export function AccountProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // { username, theme, avatar }

  // 🔹 Login
  async function fetchAccount({ username, password }) {
    const q = query(
      collection(db, "Account"),
      where("username", "==", username),
      where("password", "==", password)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data();
      setCurrentUser({
        username,
        theme: data.theme || "light",
        avatar: data.avatar || null,
      });
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

    await addDoc(collection(db, "Account"), {
      ...accountData,
      theme: "light",
      avatar: null,
    });
    setCurrentUser({ username: accountData.username, theme: "light", avatar: null });
    return true;
  }

  // 🔹 Update username (and update all lists)
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

    const listsQuery = query(collection(db, "List"), where("userId", "==", oldUsername));
    const listsSnap = await getDocs(listsQuery);

    const updatePromises = listsSnap.docs.map((listDoc) =>
      updateDoc(listDoc.ref, { userId: newUsername })
    );

    await Promise.all(updatePromises);
    setCurrentUser((prev) => ({ ...prev, username: newUsername }));
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

  // 🔹 Delete account
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

  // 🔹 Update theme
  const updateTheme = async (newTheme) => {
    if (!currentUser) return;
    const q = query(collection(db, "Account"), where("username", "==", currentUser.username));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, { theme: newTheme });
      setCurrentUser((prev) => ({ ...prev, theme: newTheme }));
    }
  };

  // 🔹 Update Avatar (Anime Avatars)
  const updateAvatar = async (newAvatarUrl) => {
    if (!currentUser) return;
    const q = query(collection(db, "Account"), where("username", "==", currentUser.username));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, { avatar: newAvatarUrl });
      setCurrentUser((prev) => ({ ...prev, avatar: newAvatarUrl }));
    }
  };

  // 🔹 Remove Avatar (New Feature)
  const removeAvatar = async () => {
    if (!currentUser) return;
    const q = query(collection(db, "Account"), where("username", "==", currentUser.username));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, { avatar: null });
      setCurrentUser((prev) => ({ ...prev, avatar: null }));
    }
  };

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
        updateTheme,
        updateAvatar,
        removeAvatar, // 👈 added here
      }}
    >
      {children}
    </accountContext.Provider>
  );
}
