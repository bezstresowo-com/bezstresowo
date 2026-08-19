<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getLocale, LOCALE_PREFIXES, LOCALES_MAP, Locale, t } from '$i18n';
	import { getPageAlternates } from '$lib/Seo/alternates-context.svelte';
	import { stripLocalePrefix } from '$lib/Seo/model';
	import { Select } from 'bits-ui';

	let open = $state(false);

	/** The language lives in the URL, so switching it is a navigation. */
	const selectedValue = $derived(getLocale());
	const selectedLabel = $derived(t.language[LOCALES_MAP[selectedValue].name].label);

	const items = $derived(
		Object.values(Locale).map((locale) => ({
			value: locale,
			label: t.language[LOCALES_MAP[locale].name].label
		}))
	);

	const pageAlternates = getPageAlternates();

	function handleOnValueChange(value: string) {
		const locale = value as Locale;

		if (locale === selectedValue) {
			return;
		}

		goto(switchTarget(locale), { invalidateAll: true });
	}

	/**
	 * Prefer the language versions the page declared through `<Seo alternates>`
	 * (blog articles have a different slug per language - swapping the prefix
	 * alone 404s there); everything else falls back to the prefix swap.
	 */
	function switchTarget(locale: Locale): string {
		const currentPath = stripLocalePrefix(page.url.pathname);

		if (pageAlternates?.path === page.url.pathname && pageAlternates.alternates) {
			const alternate = pageAlternates.alternates.find((candidate) => candidate.locale === locale);

			if (alternate) {
				return `/${LOCALE_PREFIXES[locale]}${alternate.path}${page.url.search}`;
			}

			// The page declared its versions and the target language is not among
			// them (an article without that translation) - land on the parent
			// listing instead of a guaranteed 404.
			const parentPath = currentPath.split('/').slice(0, -1).join('/');

			return `/${LOCALE_PREFIXES[locale]}${parentPath || '/home'}`;
		}

		return `/${LOCALE_PREFIXES[locale]}${currentPath}${page.url.search}`;
	}
</script>

<Select.Root
	type="single"
	value={selectedValue}
	onValueChange={handleOnValueChange}
	onOpenChange={(value) => (open = value)}
	{open}
	{items}
>
	<Select.Trigger
		class="flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-3 py-1 text-primary transition hover:bg-accent/80"
	>
		<span>
			<i class="fa fa-globe"></i>
		</span>
		{selectedLabel}
	</Select.Trigger>

	<Select.Portal>
		<Select.Content
			sideOffset={8}
			class="z-1001 rounded-lg border-2 border-accent bg-primary p-2 text-secondary"
		>
			<Select.Viewport class="flex flex-col gap-4">
				{#each items as { value, label } (value)}
					<Select.Item {value} {label}>
						{#snippet children({ selected })}
							<div
								class={`flex cursor-pointer items-center gap-4 rounded-lg p-2 hover:bg-background/30 ${selected ? 'bg-background/15' : ''}`}
							>
								<img
									class="aspect-video h-4 object-cover"
									src={LOCALES_MAP[value].iconSrc}
									alt={t.language[LOCALES_MAP[value].name].alt}
									loading="lazy"
								/>
								{label}
							</div>
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
