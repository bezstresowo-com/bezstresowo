<script lang="ts">
	import { getLocale, Locale } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';
	import { CONSULTATION_SLUG } from '$lib/ServicesSection/catalog';
	import ServiceHero from '$lib/ServicesSection/ServiceHero.svelte';
	import FirstMeeting from '$lib/ServicesSection/FirstMeeting.svelte';
	let { data } = $props();
	const product = $derived(data.product);
	const isUkrainian = $derived(getLocale() === Locale.ukUA);
	const title = $derived(product.name.replace(/\s*\([^)]*\)\s*$/, ''));
	const description = $derived(
		product.description ||
			(product.slug === CONSULTATION_SLUG
				? isUkrainian
					? 'Психотерапевтична консультація онлайн та в Лодзі. Зустріч, щоб обговорити те, що тебе турбує, та визначити, яка підтримка зараз потрібна.'
					: 'Konsultacja psychoterapeutyczna online i w Łodzi. Spotkanie, aby porozmawiać o tym, co Cię niepokoi, i ustalić, jakiego wsparcia potrzebujesz.'
				: title)
	);
</script>

<Seo
	title={`${title} | Bezstresowo`}
	description={description.replace(/\s+/g, ' ').slice(0, 180)}
/>
<ServiceHero {title} {description} imageUrl={product.imageUrl} {product} />
<FirstMeeting />
{#if product.slug === CONSULTATION_SLUG}
	<section class="mx-auto max-w-6xl border-t border-primary/10 px-5 py-10 text-primary sm:px-8">
		<h2 class="text-3xl font-semibold">
			{isUkrainian ? 'З чим можна звернутися' : 'Z czym możesz się zgłosić'}
		</h2>
		<p class="mt-5 max-w-4xl text-lg leading-relaxed text-primary/80">
			{isUkrainian
				? 'Тривога й напруга, складнощі у стосунках, виснаження, життєві зміни, невпевненість у собі або бажання краще зрозуміти власні почуття та реакції. Можна прийти й тоді, коли поки важко назвати, що саме не так.'
				: 'Lęk i napięcie, trudności w relacjach, wyczerpanie, zmiany życiowe, brak pewności siebie lub chęć lepszego zrozumienia swoich uczuć i reakcji. Możesz przyjść również wtedy, gdy trudno Ci jeszcze nazwać, co jest nie tak.'}
		</p>
	</section>
{/if}
