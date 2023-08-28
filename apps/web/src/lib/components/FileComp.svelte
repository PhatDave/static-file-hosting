<script lang="ts">
	import type { File } from '$types';
	import iconTable from '$lib/IconTable.json';
	import { FILE_URL } from '../../env';
	import { dropdownStore } from '$lib/stores/dropdownStore';
	import { fileStore } from '$lib/stores/file';
	import type { Writable } from 'svelte/store';
	import type { Action } from 'svelte/action';
	import { renameFile } from '$lib/API';

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
			doRename(nameInput.innerText.trim());
		}
	}

	function nameInputTrigger(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			doRename(nameInput.innerText.trim());
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
	}

	function doRename(newName: string) {
		$file.isEditable = false;
		renameFile($file, $file.path.replace(new RegExp(`${$file.name}$`), newName));
	}

	const draggable: Action<HTMLDetailsElement, { path: string }> = (node, param) => {
		let state = param;
		node.style.cursor = 'grab';

		function handleDragStart(e: DragEvent) {
			console.log(`Embeding path: ${param.path}`);
			e.dataTransfer?.setData('text/plain', state.path);
		}

		node.addEventListener('dragstart', handleDragStart);

		return {
			update(data) {
				state = data;
			},
			destroy() {
				node.removeEventListener('dragstart', handleDragStart);
			}
		};
	};

	let disable = false;

	const dropzone: Action<HTMLLIElement, { onDropzone: (path: string) => void }> = (node, param) => {
		let state = {
			dropEffect: 'move',
			dragover_class: 'droppable',
			...param
		};

		const handleDragEnter = (e: DragEvent & { target: HTMLElement }) => {
			e.target.classList.add('outline-2');
			e.target.classList.add('outline-primary');
			e.target.classList.add('outline');
		};

		const handleDragLeave = (e: DragEvent & { target: HTMLElement }) => {
			e.target.classList.remove('outline-2');
			e.target.classList.remove('outline');
			e.target.classList.remove('outline-primary');
		};

		const handleDragOver = (e: DragEvent & { target: HTMLElement }) => {
			e.preventDefault();
			if (!e.dataTransfer) return;
			e.dataTransfer.dropEffect = 'move';
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			const path = e.dataTransfer?.getData('text/plain') ?? '';
			console.log(`Got embeded path ${path}`);
			state.onDropzone(path);
		};

		// @ts-ignore
		node.addEventListener('dragenter', handleDragEnter);
		// @ts-ignore
		node.addEventListener('dragleave', handleDragLeave);
		// @ts-ignore
		node.addEventListener('dragover', handleDragOver);
		node.addEventListener('drop', handleDrop);

		return {
			destroy() {
				node.removeEventListener('dragenter', handleDragEnter);
				node.removeEventListener('dragleave', handleDragLeave);
				node.removeEventListener('dragover', handleDragOver);
				node.removeEventListener('drop', handleDrop);
			}
		};
	};
	// TODO: Make directory makeable
	// TODO: Make item deleteable
	// TODO: Make item renameable
	// TODO: Make folders uploadable
	// TODO: Add size display
	// Maybe tarball them on web and send them to the server to be extracted?
</script>

<li
	use:dropzone={{
		onDropzone: p => {
			console.log($file.path);
		}
	}}>
	<!-- TODO: Make these drag and droppable https://svelte.dev/repl/b225504c9fea44b189ed5bfb566df6e6?version=4.2.0 -->
	{#if $file.children}
		<details draggable={true} use:draggable={{ path: $file.path }} on:dragenter={e => {}} open>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<summary class="opacity-60" on:contextmenu={openDropdown}>
				<img class="aspect-square w-8" src="/icons/{getIcon($file)}" alt="Bronk" />
				<span bind:this={nameInput} on:keydown={nameInputTrigger} on:focusout={doUnfocus} contenteditable={$file.isEditable}>{$file.name}</span>
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
			<span bind:this={nameInput} on:keydown={nameInputTrigger} on:focusout={doUnfocus} contenteditable={$file.isEditable}>{$file.name}</span>
		</a>
	{/if}
</li>
