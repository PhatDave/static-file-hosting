<script lang="ts">
    import { getFiles } from "$lib/API";
    import FileComp from "$lib/components/FileComp.svelte";
    import { onMount } from "svelte";
    import type { File } from "$types";

    let root: File | undefined = undefined;
    onMount(async () => {
        root = await getFiles();
        console.log(root);
    });
</script>

<template>
    {#if root}
        <ul class="menu menu-xs bg-base-200 rounded-lg max-w-xs w-full">
            <FileComp file={root} />
        </ul>
    {/if}
</template>
