"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { UrlItem } from "../types/urls_type";

export function useUrlCollection() {
    const [items, setItems] = useState<UrlItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await getDocs(collection(db, "URL_Collect"));
                setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UrlItem)));
            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return { items, loading, error};
}