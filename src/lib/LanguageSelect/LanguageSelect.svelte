<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getLocale, LOCALE_PREFIXES, LOCALES_MAP, Locale, t } from '$i18n';
	import { stripLocalePrefix } from '$lib/Seo/model';
	import { Select } from 'bits-ui';

	import { ITEMS } from './model';

	let open = $state(false);

	/** The language lives in the URL, so switching it is a navigation. */
	const selectedValue = $derived(getLocale());
	const selectedLabel = $derived(LOCALES_MAP[selectedValue].label);

	function handleOnValueChange(value: string) {
		const locale = value as Locale;

		if (locale === selectedValue) {
			return;
		}

		const target = `/${LOCALE_PREFIXES[locale]}${stripLocalePrefix(page.url.pathname)}${page.url.search}`;

		goto(target, { invalidateAll: true });
	}
</script>

<Select.Root
	type="single"
	value={selectedValue}
	onValueChange={handleOnValueChange}
	onOpenChange={(value) => (open = value)}
	{open}
	items={ITEMS}
>
	<Select.Trigger
		class="flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-3 py-1 text-primary transition hover:bg-accent/80"
	>
		<span>
			<i class="fa fa-globe"></i>
		</span>
		{t(selectedLabel)}
	</Select.Trigger>

	<Select.Portal>
		<Select.Content
			sideOffset={8}
			class="z-1001 rounded-lg border-2 border-accent bg-primary p-2 text-secondary"
		>
			<Select.Viewport class="flex flex-col gap-4">
				{#each ITEMS as { value, label, disabled }, i (i + value)}
					<Select.Item {value} {label} {disabled}>
						{#snippet children({ selected })}
							<div
								class={`flex cursor-pointer items-center gap-4 rounded-lg p-2 hover:bg-background/30 ${selected ? 'bg-background/15' : ''}`}
							>
								<img
									class="aspect-video h-4 object-cover"
									src={LOCALES_MAP[value].icon.src}
									alt={t(LOCALES_MAP[value].icon.alt)}
									loading="lazy"
								/>
								{t(label)}
							</div>
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
