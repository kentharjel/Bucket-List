import { addDoc, collection } from "firebase/firestore";
import { createContext, useState } from "react";
import { db } from "../firebaseConfig";

export const accountContext = createContext()

export function AccountProvider ({ children }) {
    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])

    async function fetchAccount () {

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