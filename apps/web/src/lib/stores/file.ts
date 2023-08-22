import { writable } from "svelte/store";
import type { File } from '$types'

export const fileStore = (f: File) => {
    const { set, update, subscribe } = writable(f)

    return {
        subscribe,
        update,
        set,

    }
}