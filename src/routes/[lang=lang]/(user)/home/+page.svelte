<script lang="ts">
	import { t } from '$i18n';
	import {
		HeroSection,
		HowCanIHelpSection,
		AboutMeSection,
		ServicesSection,
		ContactForm,
		Blog,
		CertificatesSection,
		GuideSection
	} from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
	import { page } from '$app/state';
</script>

<Seo title={t.meta.home.title} description={t.meta.home.description} />

<HeroSection />
<HowCanIHelpSection />
<AboutMeSection />
<ServicesSection />

{#if $page.params.lang === 'uk'}
	<section id="current" class="bg-background px-4 py-10 text-primary sm:py-12">
		<div class="mx-auto max-w-6xl">
			<p class="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Актуальне</p>
			<div class="rounded-2xl bg-primary px-6 py-6 text-white shadow-lg sm:px-8 sm:py-7">
				<div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
					<div class="max-w-3xl">
						<h2 class="text-2xl font-semibold sm:text-3xl">Залишитись чи піти?</h2>
						<p class="mt-3 text-base leading-relaxed sm:text-lg">Закрита онлайн-група для жінок, які заплутались у своїх стосунках і втомилися постійно повертатися до питання: залишитися чи піти?</p>
						<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-secondary sm:text-base">
							<span>7 зустрічей</span>
							<span>онлайн</span>
							<span>6–8 учасниць</span>
						</div>
					</div>
					<div class="shrink-0 lg:text-right">
						<p class="text-sm uppercase tracking-[0.12em] text-secondary">Старт</p>
						<p class="mt-1 text-lg font-semibold">5 листопада 2026</p>
						<p class="mt-1 text-sm leading-relaxed text-secondary">Щочетверга · 18:30–20:00 Варшава<br />19:30–21:00 Київ · до 17 грудня</p>
						<a href="#current-details" class="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 font-semibold text-primary">Дізнатися більше</a>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<CertificatesSection />
<GuideSection compact />
<ContactForm />
<Blog siteLocation="home" />
