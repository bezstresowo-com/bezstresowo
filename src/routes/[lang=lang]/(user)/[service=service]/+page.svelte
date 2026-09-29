<script lang="ts">
	import { page } from '$app/state';
	import { getLocale, path, t, translateKey } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import ServiceHero from '$lib/ServicesSection/ServiceHero.svelte';
	import FirstMeeting from '$lib/ServicesSection/FirstMeeting.svelte';
	let { data } = $props();
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

	<ServiceHero
		title={serviceTitle}
		description={serviceDescription}
		imageUrl={data.product?.imageUrl ?? service.imageUrl}
		product={data.product}
		couples={service.slug === 'psychoterapia-par'}
	/>
	<FirstMeeting couples={service.slug === 'psychoterapia-par'} />

	<main class="bg-background/35 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
		<div class="mx-auto max-w-5xl">
			<div class="mt-10 space-y-7">
				{#each contentSections as contentSection, sectionIndex (sectionIndex)}
					<section class="border-t border-primary/10 py-7 sm:py-9">
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
				class="mt-10 rounded-2xl bg-primary px-6 py-7 text-center text-white shadow-lg sm:px-8"
			>
				<h2 class="text-xl leading-snug font-bold sm:text-2xl lg:whitespace-nowrap">
					{t.user.pages.service.finalCtaTitle}
				</h2>
				<p class="mx-auto mt-2 max-w-2xl leading-relaxed text-white/80">
					{t.user.pages.service.finalCtaDescription}
				</p>
				<Button
					href={path('/registrations')}
					tailwind="mt-5 inline-flex items-center justify-center px-7 text-primary"
				>
					{t.user.pages.service.bookConsultation}
				</Button>
			</section>
		</div>
	</main>
{/if}
