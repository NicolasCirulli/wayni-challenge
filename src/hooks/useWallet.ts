"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getWallet,
  initializeWallet,
  WALLET_STORAGE_KEY,
  WALLET_UPDATED_EVENT
} from "@/services/wallet-service";

const subscribe = (onStoreChange: () => void) => {

  const handleStorage = (event: StorageEvent) => {
    if (event.key === WALLET_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  const handleLocalUpdate = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(WALLET_UPDATED_EVENT, handleLocalUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(WALLET_UPDATED_EVENT, handleLocalUpdate);
  };
};

const getServerSnapshot = () => null;

export function useWallet() {
  const wallet = useSyncExternalStore(subscribe, getWallet, getServerSnapshot);

  useEffect(() => {
    initializeWallet();
  }, []);
  return {
    wallet,
    isLoading: wallet === null
  }
}
