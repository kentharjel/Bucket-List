import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { createContext, useState } from "react";
import { db } from "../firebaseConfig";

export const accountContext = createContext();

export function AccountProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // { username, theme }

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
      setCurrentUser({ username, theme: data.theme || "light" });
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

    await addDoc(collection(db, "Account"), { ...accountData, theme: "light" });
    setCurrentUser({ username: accountData.username, theme: "light" });
    return true;
  }

  // 🔹 Update username (and update all lists)
  async function updateAccount({ oldUsername, newUsername, password }) {
    // 1️⃣ Find the user
    const q = query(
      collection(db, "Account"),
      where("username", "==", oldUsername),
      where("password", "==", password)
    );
    const snap = await getDocs(q);
    if (snap.empty) return { success: false, message: "Incorrect password" };

    const userDoc = snap.docs[0];

    // 2️⃣ Update username in Account collection
    await updateDoc(userDoc.ref, { username: newUsername });

    // 3️⃣ Update username in all List documents
    const listsQuery = query(
      collection(db, "List"),
      where("userId", "==", oldUsername)
    );
    const listsSnap = await getDocs(listsQuery);

    const updatePromises = listsSnap.docs.map(listDoc =>
      updateDoc(listDoc.ref, { userId: newUsername })
    );

    await Promise.all(updatePromises);

    // 4️⃣ Update local state
    setCurrentUser(prev => ({ ...prev, username: newUsername }));

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
      setCurrentUser(prev => ({ ...prev, theme: newTheme }));
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
      }}
    >
      {children}
    </accountContext.Provider>
  );
}
