<script lang="ts">
    import type { File } from "$types";
    import { children } from "svelte/internal";

    export let file: File;
</script>

<template>
    <li>
        {#if file.children}
            <details open>
                <summary>{file.name}</summary>
                {#each file.children as child}
                    <svelte:self file={child} />
                {/each}
            </details>
        {:else}
            <span>{file.name}</span>
        {/if}
    </li>
</template>
