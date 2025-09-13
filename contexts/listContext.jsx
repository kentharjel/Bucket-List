import { db } from "@/firebaseConfig";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useAccount } from "../hooks/useAccount";

export const listContext = createContext();

export function ListProvider({ children }) {
  const [lists, setLists] = useState([]);
  const { currentUser } = useAccount();

  // Realtime fetch user-specific lists
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "List"), where("username", "==", currentUser));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLists(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Create list
  async function createList(listData) {
    console.log(listData)
    if (!currentUser) return;
    await addDoc(collection(db, "List"), listData);
  }

  // Toggle done
  async function toggleListDone(id, done) {
    const ref = doc(db, "List", id);
    await updateDoc(ref, { done });
  }

  // Update list text (or other fields)
  async function updateList(id, newData) {
    const ref = doc(db, "List", id);
    await updateDoc(ref, {
      ...newData,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete list
  async function deleteList(id) {
    const ref = doc(db, "List", id);
    await deleteDoc(ref);
  }

  return (
    <listContext.Provider
      value={{ lists, createList, toggleListDone, updateList, deleteList }}
    >
      {children}
    </listContext.Provider>
  );
}
