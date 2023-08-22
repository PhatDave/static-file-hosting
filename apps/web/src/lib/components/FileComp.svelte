<script lang="ts">
	import type { File } from '$types';
	import iconTable from '$lib/IconTable.json';
	import { FILE_URL } from '../../env';
	import { dropdownStore } from '$lib/stores/dropdownStore';
	import { fileStore } from '$lib/stores/file';
	import type { Writable } from 'svelte/store';

	export let f: File;
	let nameInput: HTMLSpanElement;

	const file: Writable<File> = fileStore(f);

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

	function getDownloadLink(file: File): string {
		return `${FILE_URL}/${file.path}`;
	}

	function openDropdown(event: Event) {
		event.preventDefault();
		// @ts-ignore
		dropdownStore.setClickXY(event.pageX, event.pageY);
		dropdownStore.setTarget(file);
		dropdownStore.toggleOpen();
	}

	$: {
		if ($file?.isEditable) {
			console.log(`FOCUS PLEASE`);
			console.log(nameInput);
			requestAnimationFrame(() => {
				nameInput.focus();
				const textRange = document.createRange();
				textRange.selectNodeContents(nameInput);
				textRange.collapse(false);
				const sel = window.getSelection();
				sel?.removeAllRanges();
				sel?.addRange(textRange);
			});
			setTimeout(() => nameInput.focus(), 50);
		}
	}

	function doUnfocus(event: Event) {
		if ($file.isEditable) {
			$file.isEditable = false;
			$file.name = nameInput.innerText.trim();
			doRename();
		}
	}

	function nameInputTrigger(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			$file.isEditable = false;
			$file.name = nameInput.innerText.trim();
			doRename();
			return false;
		}
	}

	function doRename() {
		console.log('Do rename!');
	}

	// TODO: Make directory makeable
	// TODO: Make item deleteable
	// TODO: Make item renameable
	// TODO: Make folders uploadable
	// Maybe tarball them on web and send them to the server to be extracted?
</script>

<li>
	<!-- TODO: Make these drag and droppable https://svelte.dev/repl/b225504c9fea44b189ed5bfb566df6e6?version=4.2.0 -->
	{#if $file.children}
		<details open>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<summary class="opacity-60" on:contextmenu={openDropdown}>
				<img class="aspect-square w-8" src="/icons/{getIcon($file)}" alt="Bronk" />
				<span bind:this={nameInput} 
				on:keydown={nameInputTrigger} 
				on:focusout={doUnfocus} 
				contenteditable={$file.isEditable}>{$file.name}</span>
			</summary>
			<ul>
				{#each $file.children as child}
					<svelte:self f={child} />
				{/each}
			</ul>
		</details>
	{:else}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<a href={getDownloadLink($file)} on:contextmenu={openDropdown} class="flex items-center">
			<img class="aspect-square w-8" src="/icons/{getIcon($file)}" alt="Bronk" />
			<span bind:this={nameInput} 
			on:keydown={nameInputTrigger} 
			on:focusout={doUnfocus} 
			contenteditable={$file.isEditable}>{$file.name}</span>
		</a>
	{/if}
</li>
