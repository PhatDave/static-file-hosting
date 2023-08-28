<script lang="ts" context="module">
	export type DropdownButton = {
		text: string;
		action: () => void;
	};
</script>

<script lang="ts">
	import { dropdownStore } from '$lib/stores/dropdownStore';

	export let buttons: DropdownButton[] = [];

	let dropdownElement: HTMLElement;
	$: {
		if (dropdownElement) {
			dropdownElement.style.left = `${$dropdownStore.clickXY.x}px`;
			dropdownElement.style.top = `${$dropdownStore.clickXY.y}px`;
		}
	}

	function closeDropdown(event: Event) {
		if ($dropdownStore.open) {
			dropdownStore.close();
			event.stopPropagation();
			event.preventDefault();
		}
	}

	function blockCtxMenu(event: Event) {
		event.stopPropagation();
		event.preventDefault();
	}
</script>

<svelte:window on:click={closeDropdown} on:contextmenu={blockCtxMenu} />
{#if $dropdownStore.open}
	<div bind:this={dropdownElement} class="z-50 absolute flex flex-col">
		{#each buttons as button}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="btn capitalize" on:click={button.action}>{button.text}</div>
		{/each}
	</div>
{/if}
