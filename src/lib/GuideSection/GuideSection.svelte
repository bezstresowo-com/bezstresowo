<script lang="ts">
	import { getLocale, t } from '$i18n';
	import { RELATIONSHIP_GUIDE_URLS } from '$shared/global/config/guide';

	let { standalone = false }: { standalone?: boolean } = $props();
	const guideUrl = $derived(RELATIONSHIP_GUIDE_URLS[getLocale()]);
</script>

<section id="materials" class="scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
	<div
		class="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-white shadow-xl sm:px-10 lg:px-14"
	>
		<div
			class="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-accent/20 blur-2xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-secondary/15 blur-2xl"
		></div>

		<div class="relative grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]">
			<div>
				<span
					class="inline-flex rounded-full border border-secondary/50 bg-white/10 px-4 py-2 text-sm font-semibold text-secondary"
				>
					{t.user.pages.materials.guide.eyebrow}
				</span>

				<svelte:element
					this={standalone ? 'h1' : 'h2'}
					class="mt-5 max-w-3xl text-3xl leading-tight font-bold sm:text-4xl"
				>
					{t.user.pages.materials.guide.title}
				</svelte:element>

				<p class="mt-4 max-w-3xl text-lg leading-relaxed text-white/85">
					{t.user.pages.materials.guide.description}
				</p>

				<ul class="mt-6 grid gap-3 sm:grid-cols-3">
					{#each t.user.pages.materials.guide.benefits as benefit (benefit)}
						<li class="flex gap-2 text-sm leading-relaxed text-white/90">
							<i class="fa-solid fa-check mt-1 text-accent" aria-hidden="true"></i>
							<span>{benefit}</span>
						</li>
					{/each}
				</ul>

				<a
					href={guideUrl}
					class="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-6 py-3 font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary focus:outline-none"
				>
					{t.user.pages.materials.guide.cta}
					<i class="fa-solid fa-arrow-right ml-3" aria-hidden="true"></i>
				</a>

				<p class="mt-3 text-sm text-white/65">{t.user.pages.materials.guide.note}</p>
			</div>

			<div class="mx-auto w-full max-w-xs" aria-hidden="true">
				<div
					class="rotate-2 rounded-3xl border border-secondary/60 bg-background p-6 text-primary shadow-2xl transition hover:rotate-0"
				>
					<div class="text-center text-8xl leading-none font-black text-accent">17</div>
					<div class="mt-4 h-px bg-accent/40"></div>
					<p class="mt-4 text-center text-xl leading-snug font-bold">
						{t.user.pages.materials.guide.coverTitle}
					</p>
					<p class="mt-4 text-center text-sm font-medium text-primary/70">BEZSTRESOWO</p>
				</div>
			</div>
		</div>
	</div>
</section>
