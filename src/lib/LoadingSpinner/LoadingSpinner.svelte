<script lang="ts">
	import { sizeClasses, type LoadingSpinnerProps } from './model';

	const {
		size = 'sm',
		color = 'border-primary',
		label = undefined,
		tailwind = undefined
	}: LoadingSpinnerProps = $props();
</script>

<div class={`inline-flex items-center gap-2 ${tailwind}`} role="status" aria-live="polite">
	<span
		class={`inline-block animate-spin rounded-full border-solid border-transparent border-t-current ${sizeClasses[size]} ${color}`}
	></span>

	{#if label}
		<span class="text-sm text-primary">
			{label}
		</span>
	{/if}
</div>
