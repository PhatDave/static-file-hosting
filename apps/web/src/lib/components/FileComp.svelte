<script lang="ts">
	import type { File } from '$types';
	import iconTable from '$lib/IconTable.json';

	export let file: File;

	function getIcon(file: File) {
		if (file.extension) {
			const extension = file.extension.replace(/^\./, '');
			if (extension in iconTable) {
				return iconTable[extension as keyof typeof iconTable] + '.svg';
			}
		}
        if (file.type === "directory") {
            return 'folder.svg';
        }
		return file.type + '.svg';
	}
</script>

<li>
	{#if file.children}
		<details open>  
			<summary>
                <img class="aspect-square w-8" src=/icons/{getIcon(file)} alt="Bronk"/>
                {file.name}
            </summary>
			<ul>
				{#each file.children as child}
					<svelte:self file={child} />
				{/each}
			</ul>
		</details>
	{:else}
		<span>
            <img class="aspect-square w-8" src=/icons/{getIcon(file)} alt="Bronk"/>
            {file.name}
        </span>
	{/if}
</li>
