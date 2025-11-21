<script lang="ts">
	import { ButtonTypes, type ButtonProps } from './model';

	const {
		children,
		disabled = false,
		type = ButtonTypes.Button,
		tailwind = '',
		href = undefined
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		{href}
		class={`h-12 cursor-pointer rounded-lg bg-accent font-medium transition hover:bg-accent/70 ${disabled ? 'cursor-not-allowed grayscale' : ''} ${tailwind}`}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		class={`h-12 cursor-pointer rounded-lg bg-accent font-medium transition hover:bg-accent/70 ${disabled ? 'cursor-not-allowed grayscale' : ''} ${tailwind}`}
	>
		{@render children?.()}
	</button>
{/if}
