<script lang="ts">
	import { getFiles } from '$lib/API';
	import FileComp from '$lib/components/FileComp.svelte';
	import { onMount } from 'svelte';
	import type { File } from '$types';
	import { dropdownStore } from '$lib/stores/dropdownStore';

	let root: File | undefined = undefined;
	onMount(async () => {
		root = await getFiles();
		console.log(root);
	});

	let dropdownElement: HTMLElement;
	$: {
		if (dropdownElement) {
			dropdownElement.style.left = `${$dropdownStore.clickXY.x}px`;
			dropdownElement.style.top = `${$dropdownStore.clickXY.y}px`;
			console.log(dropdownElement);
		}
	}

	document.onclick = (event: Event) => {
		if ($dropdownStore.open) {
			dropdownStore.close();
			event.stopPropagation();
			event.preventDefault();
		}
	};
</script>

{#if root}
	<div class="flex justify-center">
		<ul class="menu menu-lg bg-base-200 rounded-lg w-10/12 overflow-clip text-ellipsis">
			<FileComp file={root} />
		</ul>
	</div>
{/if}
{#if $dropdownStore.open}
	<div bind:this={dropdownElement} class="z-50 absolute flex flex-col">
		<div class="btn capitalize">Rename</div>
		<div class="btn capitalize">Delete</div>
		<div class="btn capitalize">New Folder</div>
	</div>
{/if}
