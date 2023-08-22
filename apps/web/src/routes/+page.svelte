<script lang="ts">
	import { getFiles } from '$lib/API';
	import FileComp from '$lib/components/FileComp.svelte';
	import { onMount } from 'svelte';
	import type { File } from '$types';
	import DropdownComp, { type DropdownButton } from '$lib/components/DropdownComp.svelte';
	import { dropdownStore } from '$lib/stores/dropdownStore';

	let root: File | undefined = undefined;
	onMount(async () => {
		root = await getFiles();
		console.log(root);
	});

	const dropdownButtons: DropdownButton[] = [];
	dropdownButtons.push({
		text: 'Rename',
		action: () => {
			$dropdownStore.target?.update(state => {
				return { ...state, isEditable: true };
			});
		}
	});
	dropdownButtons.push({
		text: 'Delete',
		action: () => {
			console.log('delete');
		}
	});
	dropdownButtons.push({
		text: 'New Folder',
		action: () => {
			console.log('new folder');
		}
	});
</script>

<DropdownComp buttons={dropdownButtons} />

{#if root}
	<div class="flex justify-center">
		<ul class="menu menu-lg bg-base-200 rounded-lg w-10/12 overflow-clip text-ellipsis">
			<FileComp f={root} />
		</ul>
	</div>
{/if}
