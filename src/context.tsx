"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import { QRCode, User } from "./types/types";
import CircularProgress from "@mui/material/CircularProgress";

type ItemsContextType = {
  items: QRCode[];
  setItems: React.Dispatch<React.SetStateAction<QRCode[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const ItemsContext = createContext<ItemsContextType | null>(null);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<QRCode[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch items from Firestore
  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return;
      try {
        const itemsCollection = collection(db, "users", user.id, "qrcodes");
        const itemsSnapshot = await getDocs(itemsCollection);
        const itemsData = itemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsData as QRCode[]);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };
    setIsLoading(true);
    fetchItems();
    setIsLoading(false);
  }, [user]);

  // Fetch user info from Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoading(true);
      if (!user) {
        setIsLoading(false);
        return;
      }
      if (user) {
        const userInfo = await fetchUserInfo();
        if (!userInfo) {
          auth.signOut();
          setIsLoading(false);
          return;
        }
        setUser(userInfo);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserInfo = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", auth?.currentUser?.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const user = auth?.currentUser;
      if (!user) return null;
      const userDoc = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      };
      const docRef = await addDoc(collection(db, "users"), userDoc);
      return { id: docRef.id, ...userDoc };
    }

    const userDoc = querySnapshot.docs[0];
    const user = {
      id: userDoc.id,
      name: userDoc.data().name,
      email: userDoc.data().email,
      photoURL: userDoc.data().photoURL,
    };
    return user;
  };

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex justify-center items-center text-[2rem]">
        <CircularProgress />
      </div>
    );

  return (
    <ItemsContext.Provider
      value={{ items, setItems, user, setUser }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export function useItems() {
  const context = React.useContext(ItemsContext);
  if (!context) {
    throw new Error(
      "ItemsContext is null, component must be used inside a ItemsProvider"
    );
  }
  return context;
}
