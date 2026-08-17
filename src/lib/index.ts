// place files you want to import through the `$lib` alias in this folder.
//
// Admin-only components (the forms, the TipTap editor) are deliberately NOT
// re-exported here: in dev the whole barrel gets evaluated, so they would drag
// class-validator, class-transformer and the editor into the module graph of
// every public page. Admin pages import them by their full path instead.
export { default as AboutMeSection } from './AboutMeSection/AboutMeSection.svelte';
export { default as Blog } from './Blog/Blog.svelte';
export { default as Button } from './Button/Button.svelte';
export { default as CertificatesSection } from './CertificatesSection/CertificatesSection.svelte';
export { default as ContactForm } from './ContactForm/ContactForm.svelte';
export { default as ErrorNotice } from './ErrorNotice/ErrorNotice.svelte';
export { default as HeroSection } from './HeroSection/HeroSection.svelte';
export { default as HowCanIHelpSection } from './HowCanIHelpSection/HowCanIHelpSection.svelte';
export { default as LanguageSelect } from './LanguageSelect/LanguageSelect.svelte';
export { default as LoadingSpinner } from './LoadingSpinner/LoadingSpinner.svelte';
export { default as PaymentResultPage } from './PaymentResultPage/PaymentResultPage.svelte';
export { default as Seo } from './Seo/Seo.svelte';
export { default as ServicesSection } from './ServicesSection/ServicesSection.svelte';
