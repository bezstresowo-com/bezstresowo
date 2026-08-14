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
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title="meta.home.title" description="meta.home.description" />

<HeroSection />
<HowCanIHelpSection />
<AboutMeSection />
<CertificatesSection />
<ServicesSection />
<ContactForm />
<Blog siteLocation="home" />
