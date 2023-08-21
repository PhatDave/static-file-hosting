import { writable } from "svelte/store";
import type { File } from "$types";

function createStore() {
    type StoreType = {
        target: File | undefined;
        clickXY: { x: number; y: number };
        open: boolean;
    }

    const { set, subscribe, update } = writable<StoreType>({ target: undefined, clickXY: { x: 0, y: 0 }, open: false });

    return {
        subscribe,
        update,
        set,
        toggleOpen: () => update(state => {
            return { ...state, open: !state.open };
        }),
        setClickXY: (x: number, y: number) => update(state => {
            return { ...state, clickXY: { x, y } };
        }),
        close: () => update(state => {
            return { ...state, open: false };
        }),
        setTarget: (file: File) => update(state =>  {
            return { ...state, target: file };
        }),
    };
};

export const dropdownStore = createStore();

