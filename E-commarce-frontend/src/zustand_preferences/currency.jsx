import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCurrencyStore = create(
    persist(
        (set, get) => ({
            currency: "USD",
            locale : "en-US",
            conversion_rate: {
                USD: 1,
                EUR: 1,
                EGP: 1
            },
            setCurrency: (currency) => set({ currency: currency }),
            setLocale: (locale) => set({ locale: locale }),
            setConversionRate: (conversion_rate) => set({ conversion_rate: conversion_rate }),
            getCurrency: () => get().currency,
            getLocale: () => get().locale,
            getConversionRate: () => get().conversion_rate
        }),
        {
            name: "currency",
        }
    )
);