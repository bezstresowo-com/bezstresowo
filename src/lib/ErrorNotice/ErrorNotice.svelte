<script lang="ts">
	import { t } from '$i18n';
	import { remoteErrorMessage } from '$shared/global/functions/remote-error';

	let {
		error,
		reset,
		tailwind = ''
	}: { error: unknown; reset?: () => void; tailwind?: string } = $props();
</script>

<div
	class={`rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700 ${tailwind}`}
	role="alert"
>
	<p>{t(remoteErrorMessage(error))}</p>

	{#if reset}
		<button
			type="button"
			class="mt-4 cursor-pointer rounded-md border border-red-300 px-4 py-2 text-sm font-medium hover:bg-red-100"
			onclick={reset}
		>
			{t('api.errors.retry')}
		</button>
	{/if}
</div>
