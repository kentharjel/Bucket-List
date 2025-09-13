import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useState } from "react";
import { db } from "../firebaseConfig";

export const accountContext = createContext()

export function AccountProvider ({ children }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [currentUser, setCurrentUser] = useState('')

    async function fetchAccount(accountData) {
        const { username, password } = accountData;

            const account = query(
                collection(db, "Account"),
                where("username", "==", username),
                where("password", "==", password)
            );

            const verify = await getDocs(account);

            if (!verify.empty) {
                setCurrentUser(username);
                return true;
            } else {
                return false;
            }
    }

    async function logout() {
        setCurrentUser(null)
    }

    async function createAccount (accountData) {
        console.log(accountData)
        await addDoc(collection(db, 'Account'), accountData)
    }

    async function deleteAccount() {

    }

    async function updateAccount() {

    }

    return(
        <accountContext.Provider
            value={{username, password, currentUser, fetchAccount, logout, createAccount, deleteAccount, updateAccount}}
        >
            { children }
        </accountContext.Provider>
    )
}