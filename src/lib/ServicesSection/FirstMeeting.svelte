<script lang="ts">
	import { getLocale, Locale } from '$i18n';
	let { couples = false } = $props<{ couples?: boolean }>();
	const uk = $derived(getLocale() === Locale.ukUA);
</script>

<section class="mx-auto max-w-6xl px-5 py-10 text-primary sm:px-8 sm:py-12">
	<h2 class="font-serif text-3xl font-normal sm:text-4xl">
		{uk ? 'Як проходить перша зустріч' : 'Jak wygląda pierwsze spotkanie'}
	</h2>
	<div class="mt-4 h-0.5 w-16 bg-accent"></div>
	<p class="mt-5 max-w-4xl text-lg leading-relaxed text-primary/80">
		{uk
			? couples
				? 'Знайомимося, даємо кожному можливість розповісти про своє бачення ситуації та обговорюємо, над чим ви хочете працювати. Разом визначаємо можливі подальші кроки.'
				: 'Знайомимося, говоримо про те, що тебе турбує, та разом визначаємо, яка підтримка може бути корисною. Не потрібно заздалегідь знати, з чого почати, або мати чітко сформульований запит.'
			: couples
				? 'Poznajemy się, dajemy każdej osobie przestrzeń na przedstawienie swojego punktu widzenia i rozmawiamy o tym, nad czym chcecie pracować. Wspólnie ustalamy możliwe kolejne kroki.'
				: 'Poznajemy się, rozmawiamy o tym, co Cię niepokoi, i wspólnie zastanawiamy się, jakie wsparcie może być pomocne. Nie musisz wcześniej wiedzieć, od czego zacząć, ani mieć jasno sformułowanego celu.'}
	</p>
	<div class="mt-8 grid gap-7 md:grid-cols-3 md:gap-8">
		<div class="md:border-r md:border-accent/40 md:pr-7">
			<h3 class="font-serif text-xl font-semibold">
				{uk ? 'Чи потрібно готуватися?' : 'Czy trzeba się przygotować?'}
			</h3>
			<p class="mt-3 leading-relaxed text-primary/75">
				{uk
					? 'Спеціальна підготовка не потрібна. Для онлайн-зустрічі обери приватне місце, де можна спокійно говорити, і перевір інтернет.'
					: 'Specjalne przygotowanie nie jest potrzebne. Na spotkanie online wybierz prywatne miejsce, gdzie możesz spokojnie rozmawiać, i sprawdź połączenie internetowe.'}
			</p>
		</div>
		<div class="md:border-r md:border-accent/40 md:pr-7">
			<h3 class="font-serif text-xl font-semibold">
				{uk
					? 'Чи потрібно одразу вирішувати щодо терапії?'
					: 'Czy trzeba od razu zdecydować się na terapię?'}
			</h3>
			<p class="mt-3 leading-relaxed text-primary/75">
				{uk
					? 'Ні. Перша зустріч дає можливість познайомитися, поставити запитання та обговорити подальші кроки. Можна взяти час на рішення.'
					: 'Nie. Pierwsze spotkanie daje możliwość poznania się, zadania pytań i omówienia dalszych kroków. Możesz dać sobie czas na decyzję.'}
			</p>
		</div>
		<div>
			<h3 class="font-serif text-xl font-semibold">
				{uk ? 'Як погодити зустріч?' : 'Jak uzgodnić spotkanie?'}
			</h3>
			<p class="mt-3 leading-relaxed text-primary/75">
				{uk
					? 'Спочатку погоджуємо дату, час і формат. Кнопка «Оплатити узгоджену зустріч» призначена для оплати вже погодженої консультації й сама по собі не резервує час.'
					: 'Najpierw uzgadniamy datę, godzinę i formę spotkania. Przycisk „Opłać uzgodnione spotkanie” służy do opłacenia już ustalonej konsultacji i sam w sobie nie rezerwuje terminu.'}
			</p>
		</div>
	</div>
</section>
