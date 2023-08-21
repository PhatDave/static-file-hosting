import { API_URL } from "../env";
import type { File } from "$types";

export async function getFiles(): Promise<File> {
    const res = await fetch(API_URL);
    const json = await res.json();
    return json.root as File;
}