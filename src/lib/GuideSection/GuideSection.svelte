<script lang="ts">
	import { getLocale, t } from '$i18n';
	import { RELATIONSHIP_GUIDE_URLS } from '$shared/global/config/guide';

	let { standalone = false, compact = false }: { standalone?: boolean; compact?: boolean } =
		$props();
	const guideUrl = $derived(RELATIONSHIP_GUIDE_URLS[getLocale()]);
</script>

<section
	id="materials"
	class={compact
		? 'scroll-mt-20 px-4 py-8 sm:px-6 sm:py-10'
		: 'scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16'}
>
	<div
		class={compact
			? 'relative overflow-hidden rounded-3xl bg-primary px-6 py-7 text-white shadow-lg sm:px-9 sm:py-8 lg:px-11'
			: 'relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-white shadow-xl sm:px-10 lg:px-14'}
	>
		<div
			class="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-accent/20 blur-2xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-secondary/15 blur-2xl"
		></div>

		<div
			class={compact
				? 'relative grid items-center gap-7 md:grid-cols-[1fr_auto]'
				: 'relative grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]'}
		>
			<div>
				<span
					class={compact
						? 'inline-flex rounded-full border border-secondary/50 bg-white/10 px-3 py-1.5 text-xs font-semibold text-secondary'
						: 'inline-flex rounded-full border border-secondary/50 bg-white/10 px-4 py-2 text-sm font-semibold text-secondary'}
				>
					{compact
						? t.user.pages.materials.guide.compactEyebrow
						: t.user.pages.materials.guide.eyebrow}
				</span>

				<svelte:element
					this={standalone ? 'h1' : 'h2'}
					class={compact
						? 'mt-3 max-w-3xl text-2xl leading-tight font-bold sm:text-3xl'
						: 'mt-5 max-w-3xl text-3xl leading-tight font-bold sm:text-4xl'}
				>
					{t.user.pages.materials.guide.title}
				</svelte:element>

				<p
					class={compact
						? 'mt-3 max-w-3xl leading-relaxed text-white/80'
						: 'mt-4 max-w-3xl text-lg leading-relaxed text-white/85'}
				>
					{t.user.pages.materials.guide.description}
				</p>

				{#if !compact}
					<ul class="mt-6 grid gap-3 sm:grid-cols-3">
						{#each t.user.pages.materials.guide.benefits as benefit (benefit)}
							<li class="flex gap-2 text-sm leading-relaxed text-white/90">
								<i class="fa-solid fa-check mt-1 text-accent" aria-hidden="true"></i>
								<span>{benefit}</span>
							</li>
						{/each}
					</ul>
				{/if}

				<a
					href={guideUrl}
					class={compact
						? 'mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-2.5 font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary focus:outline-none'
						: 'mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-6 py-3 font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary focus:outline-none'}
				>
					{t.user.pages.materials.guide.cta}
					<i class="fa-solid fa-arrow-right ml-3" aria-hidden="true"></i>
				</a>

				{#if !compact}
					<p class="mt-3 text-sm text-white/65">{t.user.pages.materials.guide.note}</p>
				{/if}
			</div>

			<div
				class={compact ? 'mx-auto hidden w-36 md:block' : 'mx-auto w-full max-w-xs'}
				aria-hidden="true"
			>
				<div
					class={compact
						? 'rotate-2 rounded-2xl border border-secondary/60 bg-background p-4 text-primary shadow-xl transition hover:rotate-0'
						: 'rotate-2 rounded-3xl border border-secondary/60 bg-background p-6 text-primary shadow-2xl transition hover:rotate-0'}
				>
					<div
						class={compact
							? 'text-center text-5xl leading-none font-black text-accent'
							: 'text-center text-8xl leading-none font-black text-accent'}
					>
						17
					</div>
					<div class={compact ? 'mt-3 h-px bg-accent/40' : 'mt-4 h-px bg-accent/40'}></div>
					<p
						class={compact
							? 'mt-3 text-center text-sm leading-snug font-bold'
							: 'mt-4 text-center text-xl leading-snug font-bold'}
					>
						{t.user.pages.materials.guide.coverTitle}
					</p>
					{#if !compact}
						<p class="mt-4 text-center text-sm font-medium text-primary/70">BEZSTRESOWO</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>
