<script lang="ts">
    import type { File } from "$types";
    import { children } from "svelte/internal";

    export let file: File;
</script>

<template>
    {file.name}
    {#if file.children}
        {#each file.children as child}
            <FileComp file={child} />
        {/each}
    {/if}
</template>