import { API_URL } from "../env";
import type { File } from "$types";
import cachedItems from "./cache.json";

export async function getFiles(): Promise<File> {
    // const res = await fetch(API_URL);
    // const json = await res.json();
    // return json.root as File;
    return cachedItems as File;
}