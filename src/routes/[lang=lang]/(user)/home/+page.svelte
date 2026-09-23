<script lang="ts">
	import { path, t } from '$i18n';
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

{#if page.params.lang === 'uk'}
	<section id="current" class="bg-background px-4 py-7 text-primary sm:py-9">
		<div class="mx-auto max-w-6xl">
			<p class="mb-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase sm:text-sm">
				Актуальне
			</p>
			<div class="rounded-2xl bg-primary px-5 py-5 text-white shadow-lg sm:px-7 sm:py-6">
				<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
					<div class="max-w-3xl">
						<h2 class="text-2xl font-semibold sm:text-3xl">Залишитись чи піти?</h2>
						<p class="mt-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
							Закрита онлайн-група для жінок, які вже не вперше думають про розставання, але щоразу
							повертаються до сумнівів.
						</p>
						<div class="mt-3 flex flex-wrap gap-x-2 gap-y-1.5 text-sm font-medium text-secondary">
							<span>7 зустрічей</span><span aria-hidden="true">·</span>
							<span>онлайн</span><span aria-hidden="true">·</span>
							<span>6–8 учасниць</span>
						</div>
					</div>
					<div class="shrink-0 lg:min-w-80 lg:text-right">
						<p class="text-base font-semibold text-white">5 листопада – 17 грудня 2026</p>
						<p class="mt-1 text-sm leading-relaxed text-secondary">
							Щочетверга · 18:30–20:00 Варшава<br />19:30–21:00 Київ
						</p>
						<a
							href={path('/zalyshytys-chy-pity')}
							class="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 py-2.5 font-semibold text-primary transition hover:bg-secondary"
							>Дізнатися більше</a
						>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<CertificatesSection compact />
<GuideSection compact />
<ContactForm />
<Blog siteLocation="home" />
