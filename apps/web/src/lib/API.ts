import { API_URL, DEFAULT_PATCH_OPTIONS } from "../env";
import type { File } from "$types";

export async function getFiles(): Promise<File> {
    const res = await fetch(API_URL);
    const json = await res.json();
    return json.root as File;
}

export async function renameFile(file: File, newPath: string): Promise<File> {
    const res = await fetch(`${API_URL}/${file.path}?path=${newPath}`, DEFAULT_PATCH_OPTIONS);
    const json = await res.json();
    return json.root as File;
}