<script lang="ts">
	import {
		HeroSection,
		HowCanIHelpSection,
		AboutMeSection,
		ServicesSection,
		ContactForm,
		Blog,
		CertificatesSection
	} from '$lib';
	import { translate } from '$i18n';

	const prefix = 'user.pages.home';
</script>

<svelte:head>
	<title>{$translate(`${prefix}.title`)} - Bezstresowo</title>
	<meta name="description" content={$translate(`${prefix}.description`)} />
</svelte:head>

<HeroSection />
<HowCanIHelpSection />
<AboutMeSection />
<CertificatesSection />
<ServicesSection />
<ContactForm />
<Blog />
