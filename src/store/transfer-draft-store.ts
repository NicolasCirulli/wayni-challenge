"use client";

import { create } from "zustand";
import type { User } from "@/types/user";
type TransferOrigin = "transfer" | "send-again";
interface TransferDraftState {
    from: TransferOrigin | null;
    recipient: User | null;
    amount: string;
    concept: string;

    setFrom: (from: TransferOrigin) => void;
    setRecipient: (recipient: User) => void;
    setAmount: (amount: string) => void;
    setConcept: (concept: string) => void;
    resetDraft: () => void;
}

const initialState = {
    from: null,
    recipient: null,
    amount: "",
    concept: "",
};

export const useTransferDraftStore = create<TransferDraftState>((set) => {
    return {
        ...initialState,
        setFrom: (from) => set({ from }),
        setRecipient: (recipient) => set({ recipient }),
        setAmount: (amount) => set({ amount }),
        setConcept: (concept) => set({ concept }),
        resetDraft: () => set(initialState),
    }
});