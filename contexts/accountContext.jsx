import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useState } from "react";
import { db } from "../firebaseConfig";

export const accountContext = createContext()

export function AccountProvider ({ children }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function fetchAccount(accountData) {
        const { username, password } = accountData;

            const account = query(
                collection(db, "Account"),
                where("username", "==", username),
                where("password", "==", password)
            );

            const verify = await getDocs(account);

            if (!verify.empty) {
                return true;
            } else {
                return false;
            }

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
            value={{username, password, fetchAccount, createAccount, deleteAccount, updateAccount}}
        >
            { children }
        </accountContext.Provider>
    )
}