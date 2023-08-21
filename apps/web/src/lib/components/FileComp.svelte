<script lang="ts">
    import type { File } from "$types";

    export let file: File;
</script>

<li>
    {#if file.children}
        <details open>
            <summary>{file.name}</summary>
            <ul>
                {#each file.children as child}
                    <svelte:self file={child} />
                {/each}
            </ul>
        </details>
    {:else}
        <span>{file.name}</span>
    {/if}
</li>
