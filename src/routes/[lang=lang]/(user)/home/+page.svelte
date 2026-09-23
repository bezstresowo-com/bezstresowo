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
	<section id="current" class="bg-background px-4 py-14 text-primary">
		<div class="mx-auto max-w-6xl">
			<p class="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Актуальне</p>
			<div class="rounded-2xl bg-primary p-7 text-white shadow-lg sm:p-10">
				<h2 class="text-3xl font-semibold sm:text-4xl">Залишитись чи піти?</h2>
				<p class="mt-4 max-w-3xl text-lg leading-relaxed">Закрита онлайн-група для жінок, які заплутались у своїх стосунках і втомилися постійно повертатися до питання: залишитися чи піти?</p>
				<div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-secondary"><span>7 зустрічей</span><span>онлайн</span><span>6–8 учасниць</span><span>старт: листопад 2026</span></div>
				<a href="#current-details" class="mt-7 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-primary">Дізнатися більше</a>
			</div>
		</div>
	</section>
{/if}

<CertificatesSection />
<GuideSection compact />
<ContactForm />
<Blog siteLocation="home" />
