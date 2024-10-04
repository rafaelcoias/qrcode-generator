"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Define the type for your context
type ItemsContextType = {
  items: any;
  setItems: React.Dispatch<React.SetStateAction<any>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

// Set default values for the context (use no-op for setItems and setUser initially)
export const ItemsContext = createContext<ItemsContextType | null>(null);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);



  useEffect(() => {
    const fetchItems = async () => {
        const itemsCollection = collection(db, "users", user.id, "qrcodes");
        const itemsSnapshot = await getDocs(itemsCollection);
        const itemsData = itemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsData);
    };
    if (!user) return;
    setIsLoading(true);
    fetchItems();
    setIsLoading(false);
  }, [user]);

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex justify-center items-center text-[2rem]">
        <h1>Loading...</h1>
      </div>
    );

  return (
    <ItemsContext.Provider value={{ items, setItems, user, setUser }}>
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
