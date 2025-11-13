<script lang="ts">
	const {
		children,
		disabled = false,
		type = 'button',
		tailwind = '',
		href = undefined
	}: {
		children?: any;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		tailwind?: string;
		href?: string;
	} = $props();

</script>

{#if href}
	<a
		{href}
		class={`cursor-pointer h-12 rounded-lg bg-accent font-medium transition hover:bg-accent/70 ${disabled} ? 'cursor-not-allowed grayscale' : '' ${tailwind}`}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		class={`cursor-pointer h-12 rounded-lg bg-accent font-medium transition hover:bg-accent/70 ${disabled} ? 'cursor-not-allowed grayscale' : '' ${tailwind}`}
	>
		{@render children?.()}
	</button>
{/if}
