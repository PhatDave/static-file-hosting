<script lang="ts">
	import { getFiles } from '$lib/API';
	import FileComp from '$lib/components/FileComp.svelte';
	import { onMount } from 'svelte';
	import type { File } from '$types';

	let root: File | undefined = undefined;
	onMount(async () => {
		root = await getFiles();
		console.log(root);
	});
</script>

{#if root}
	<div class="flex justify-center">
		<ul class="menu menu-lg bg-base-200 rounded-lg w-10/12 overflow-clip text-ellipsis">
			<FileComp file={root} />
		</ul>
	</div>
{/if}
