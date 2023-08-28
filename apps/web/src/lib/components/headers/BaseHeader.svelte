<script lang="ts">
    import ThemeToggle from "$components/theme/ThemeToggle.svelte";
    import Fa from "svelte-fa";

    Fa;
</script>

<div class="flex h-20 items-center justify-end px-4">
    <div class="[&>*:hover]:text-primary flex items-center space-x-4 [&>*]:transition-all [&>*]:duration-300">
        <ThemeToggle />
    </div>
</div>
