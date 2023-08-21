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
        <FileComp file={root} />
    {/if}
</template>
