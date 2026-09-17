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
</script>

<Seo title={t.meta.home.title} description={t.meta.home.description} />

<HeroSection />
<HowCanIHelpSection />
<AboutMeSection />
<CertificatesSection />
<ServicesSection />
<GuideSection compact />
<ContactForm />
<Blog siteLocation="home" />
