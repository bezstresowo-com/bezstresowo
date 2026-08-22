<script lang="ts">
	import { t } from '$i18n';
	import {
		HeroSection,
		HowCanIHelpSection,
		AboutMeSection,
		ServicesSection,
		ContactForm,
		Blog,
		CertificatesSection
	} from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title={t.meta.home.title} description={t.meta.home.description} />

<HeroSection />
<HowCanIHelpSection />
<AboutMeSection />
<CertificatesSection />
<ServicesSection />
<ContactForm />
<Blog siteLocation="home" />
