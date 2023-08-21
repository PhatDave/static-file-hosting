<script lang="ts">
	import type { File } from '$types';
	import iconTable from '$lib/IconTable.json';
	import { ORIGIN } from '../../env';

	export let file: File;

	function getIcon(file: File) {
		if (file.extension) {
			const extension = file.extension.replace(/^\./, '');
			if (extension in iconTable) {
				return iconTable[extension as keyof typeof iconTable] + '.svg';
			}
		}
		if (file.type === 'directory') {
			return 'folder.svg';
		}
		return file.type + '.svg';
	}

	// TODO: Make directory makeable
	// TODO: Make item deleteable
	// TODO: Make item renameable
	// TODO: Make folders uploadable
	// Maybe tarball them on web and send them to the server to be extracted?

	function getDownloadLink(file: File): string {
		return `${ORIGIN}/${file.path}`;
	}
</script>

<li>
	<!-- TODO: Make these drag and droppable https://svelte.dev/repl/b225504c9fea44b189ed5bfb566df6e6?version=4.2.0 -->
	{#if file.children}
		<details>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<summary class="opacity-60">
				<img class="aspect-square w-8" src="/icons/{getIcon(file)}" alt="Bronk" />
				{file.name}
			</summary>
			<ul>
				{#each file.children as child}
					<svelte:self file={child} />
				{/each}
			</ul>
		</details>
	{:else}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<a href={getDownloadLink(file)} class="flex items-center">
			<img class="aspect-square w-8" src="/icons/{getIcon(file)}" alt="Bronk" />
			{file.name}
		</a>
	{/if}
</li>
