<script lang="ts">
	import { ButtonTypes, type ButtonProps } from './model';

	const {
		children,
		disabled = false,
		type = ButtonTypes.Button,
		tailwind = '',
		href = undefined,
		onclick = undefined
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		{href}
		class={`h-12 rounded-lg bg-accent font-medium transition hover:bg-accent/80 ${disabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer'} ${tailwind}`}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		{onclick}
		class={`h-12 rounded-lg bg-accent font-medium transition hover:bg-accent/80 ${disabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer'} ${tailwind}`}
	>
		{@render children?.()}
	</button>
{/if}
