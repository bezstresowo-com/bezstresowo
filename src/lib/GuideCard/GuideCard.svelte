<script lang="ts">
	import { getLocale, t } from '$i18n';
	import { RELATIONSHIP_GUIDE_URLS } from '$shared/global/config/guide';

	const guideUrl = $derived(RELATIONSHIP_GUIDE_URLS[getLocale()]);
</script>

<article
	class="flex h-full max-w-md flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
>
	<div class="relative overflow-hidden bg-primary px-6 py-7 text-white">
		<div
			class="pointer-events-none absolute -top-20 -right-16 size-48 rounded-full bg-accent/25 blur-2xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-16 -left-12 size-40 rounded-full bg-secondary/15 blur-2xl"
		></div>

		<div class="relative flex items-end justify-between gap-5">
			<div>
				<p class="text-xs font-semibold tracking-wide text-secondary uppercase">Bezstresowo</p>
				<div class="mt-3 text-6xl leading-none font-black text-accent">17</div>
				<p class="mt-2 max-w-48 text-sm leading-snug font-bold">
					{t.user.pages.materials.guide.coverTitle}
				</p>
			</div>
			<i class="fa-regular fa-file-lines text-5xl text-secondary/70" aria-hidden="true"></i>
		</div>
	</div>

	<div class="flex flex-1 flex-col p-6">
		<p class="text-sm font-semibold text-accent">{t.user.pages.materials.guide.eyebrow}</p>
		<h2 class="mt-3 text-xl leading-snug font-bold text-primary sm:text-2xl">
			{t.user.pages.materials.guide.title}
		</h2>
		<p class="mt-3 flex-1 leading-relaxed text-slate-600">
			{t.user.pages.materials.guide.description}
		</p>

		<a
			href={guideUrl}
			class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-center font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
		>
			{t.user.pages.materials.guide.cta}
			<i class="fa-solid fa-arrow-right ml-3" aria-hidden="true"></i>
		</a>
	</div>
</article>
