<script lang="ts">
	import { page } from '$app/state';
	import { getLocale, path, t, translateKey } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { getServiceBySlug, getServiceContentSections } from '$lib/ServicesSection/model';
	import { absoluteUrl } from '$shared/global/functions/site-url';

	const service = $derived(getServiceBySlug(page.params.service ?? ''));
	const contentSections = $derived(service ? getServiceContentSections(service) : []);
	const serviceTitle = $derived(service ? translateKey(`${service.prefix}.title`) : '');
	const serviceDescription = $derived(service ? translateKey(`${service.prefix}.description`) : '');
	const seoTitle = $derived(service ? translateKey(`${service.prefix}.seoTitle`) : '');
	const seoDescription = $derived(service ? translateKey(`${service.prefix}.seoDescription`) : '');
	const jsonLd = $derived(
		service
			? {
					'@context': 'https://schema.org',
					'@type': 'Service',
					name: serviceTitle,
					description: seoDescription,
					url: absoluteUrl(page.url.pathname),
					inLanguage: getLocale(),
					areaServed: {
						'@type': 'City',
						name: 'Łódź'
					},
					provider: {
						'@type': 'ProfessionalService',
						name: 'Centrum Psychoterapii Bezstresowo',
						url: absoluteUrl('/pl/home')
					}
				}
			: undefined
	);
</script>

{#if service}
	<Seo title={seoTitle} description={seoDescription} {jsonLd} />

	<section class="overflow-hidden bg-linear-150 from-primary via-primary to-primary/90 text-white">
		<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
			<a
				href={path('/home#services')}
				class="inline-flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-white"
			>
				<i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
				{t.user.pages.service.backToServices}
			</a>

			<div class="mt-8 grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
				<div>
					<div
						class="flex items-center gap-3 text-sm font-semibold tracking-wide text-secondary uppercase"
					>
						<i class={`${service.icon} text-xl`} aria-hidden="true"></i>
						{t.user.pages.service.eyebrow}
					</div>
					<h1 class="mt-4 max-w-4xl text-4xl leading-tight font-bold sm:text-5xl">
						{serviceTitle}
					</h1>
					<p class="mt-5 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
						{serviceDescription}
					</p>
					<Button
						href={path('/registrations')}
						tailwind="mt-7 inline-flex items-center justify-center px-7 text-primary shadow-lg"
					>
						{t.user.pages.service.bookConsultation}
						<i class="fa-solid fa-arrow-right ml-2 text-sm" aria-hidden="true"></i>
					</Button>
				</div>

				<aside
					class="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-sm"
				>
					<div class="flex gap-4 border-b border-white/15 pb-5">
						<i class="fa-solid fa-video mt-1 text-xl text-secondary" aria-hidden="true"></i>
						<div>
							<div class="text-sm text-white/65">{t.user.pages.service.formatLabel}</div>
							<div class="mt-1 font-semibold">{t.user.pages.service.formatValue}</div>
						</div>
					</div>
					<div class="flex gap-4 pt-5">
						<i class="fa-solid fa-language mt-1 text-xl text-secondary" aria-hidden="true"></i>
						<div>
							<div class="text-sm text-white/65">{t.user.pages.service.languagesLabel}</div>
							<div class="mt-1 font-semibold">{t.user.pages.service.languagesValue}</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	</section>

	<main class="bg-background/35 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
		<div class="mx-auto max-w-4xl">
			<aside class="rounded-2xl border border-accent/45 bg-white p-6 shadow-sm sm:p-8">
				<div class="flex flex-col gap-5 sm:flex-row sm:items-start">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xl text-primary"
					>
						<i class="fa-regular fa-comments" aria-hidden="true"></i>
					</div>
					<div>
						<h2 class="text-2xl font-bold text-primary">
							{t.user.pages.service.firstMeetingTitle}
						</h2>
						<p class="mt-3 leading-relaxed text-slate-600">
							{t.user.pages.service.firstMeetingDescription}
						</p>
						<p class="mt-3 flex items-start gap-2 text-sm font-medium text-primary/80">
							<i class="fa-solid fa-shield-heart mt-1 text-accent" aria-hidden="true"></i>
							<span>{t.user.pages.service.confidentiality}</span>
						</p>
					</div>
				</div>
			</aside>

			<div class="mt-10 space-y-7">
				{#each contentSections as contentSection, sectionIndex (sectionIndex)}
					<section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/8 sm:p-8">
						{#if contentSection.titleKey}
							<h2
								class="border-l-4 border-accent pl-4 text-2xl leading-snug font-bold text-primary"
							>
								{@html translateKey(contentSection.titleKey)}
							</h2>
						{/if}

						<div
							class:mt-5={contentSection.titleKey}
							class="space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg"
						>
							{#each contentSection.blocks as block, blockIndex (blockIndex)}
								{#if block.type === 'paragraph'}
									<p class="[&_b]:font-semibold [&_b]:text-primary">
										{@html translateKey(block.translationKey)}
									</p>
								{:else}
									<ul class="space-y-3">
										{#each block.translationKeys as translationKey (translationKey)}
											<li class="flex items-start gap-3">
												<span
													class="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[0.65rem] text-primary"
												>
													<i class="fa-solid fa-check" aria-hidden="true"></i>
												</span>
												<span>{@html translateKey(translationKey)}</span>
											</li>
										{/each}
									</ul>
								{/if}
							{/each}
						</div>
					</section>
				{/each}
			</div>

			<section
				class="mt-10 rounded-2xl bg-primary px-6 py-9 text-center text-white shadow-lg sm:px-10"
			>
				<h2 class="text-2xl font-bold sm:text-3xl">{t.user.pages.service.finalCtaTitle}</h2>
				<p class="mx-auto mt-3 max-w-2xl leading-relaxed text-white/80">
					{t.user.pages.service.finalCtaDescription}
				</p>
				<Button
					href={path('/registrations')}
					tailwind="mt-6 inline-flex items-center justify-center px-7 text-primary"
				>
					{t.user.pages.service.bookConsultation}
				</Button>
			</section>
		</div>
	</main>
{/if}
