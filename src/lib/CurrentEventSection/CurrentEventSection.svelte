<script lang="ts">
	import { getLocale, Locale, path } from '$i18n';

	const isUkrainian = $derived(getLocale() === Locale.ukUA);
</script>

{#if isUkrainian}
	<section id="aktualne" class="scroll-mt-24 bg-white px-4 py-12 sm:px-6 sm:py-16">
		<div
			class="relative overflow-hidden rounded-3xl bg-primary px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10 lg:px-14"
		>
			<div
				class="pointer-events-none absolute -top-28 -right-20 size-80 rounded-full bg-accent/20 blur-3xl"
			></div>
			<div
				class="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-secondary/15 blur-3xl"
			></div>

			<div class="relative grid items-center gap-9 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
				<div>
					<span
						class="inline-flex rounded-full border border-secondary/50 bg-white/10 px-4 py-2 text-sm font-semibold tracking-wide text-secondary uppercase"
					>
						Актуальне
					</span>

					<p class="mt-5 text-sm font-semibold tracking-[0.16em] text-secondary uppercase">
						Закрита онлайн-група для жінок
					</p>
					<h2 class="mt-2 max-w-3xl text-4xl leading-tight font-bold sm:text-5xl">
						Залишитись чи піти?
					</h2>
					<p class="mt-5 max-w-3xl text-lg leading-relaxed text-white/85">
						Для жінок, які заплуталися у стосунках, постійно повертаються до одного питання і хочуть
						почути себе без тиску та чужих готових відповідей.
					</p>
					<p class="mt-4 max-w-3xl leading-relaxed text-white/75">
						Психоедукація, практичні вправи й уважна групова розмова допоможуть відокремити факти
						від надії, страху та провини, побачити власні потреби й повернути собі здатність
						обирати.
					</p>

					<a
						href={path('/registrations')}
						class="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 py-3 font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary focus:outline-none"
					>
						Подати заявку
						<i class="fa-solid fa-arrow-right ml-3" aria-hidden="true"></i>
					</a>
					<p class="mt-3 text-sm leading-relaxed text-white/60">
						Спочатку коротка анкета. За потреби я запропоную коротку розмову перед приєднанням до
						групи.
					</p>
				</div>

				<div class="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-7">
					<h3 class="text-xl font-bold text-secondary">Формат групи</h3>
					<ul class="mt-5 space-y-4">
						<li class="flex gap-3">
							<i class="fa-solid fa-video mt-1 w-5 text-accent" aria-hidden="true"></i>
							<span><strong>Онлайн</strong>, зустрічі українською мовою</span>
						</li>
						<li class="flex gap-3">
							<i class="fa-regular fa-calendar mt-1 w-5 text-accent" aria-hidden="true"></i>
							<span><strong>7 щотижневих зустрічей</strong> по 90 хвилин</span>
						</li>
						<li class="flex gap-3">
							<i class="fa-solid fa-people-group mt-1 w-5 text-accent" aria-hidden="true"></i>
							<span><strong>6–8 учасниць</strong>, закритий склад групи</span>
						</li>
						<li class="flex gap-3">
							<i class="fa-solid fa-lock mt-1 w-5 text-accent" aria-hidden="true"></i>
							<span>Без записів, щоб зберегти приватність і безпечну атмосферу</span>
						</li>
					</ul>

					<div class="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-6">
						<div>
							<p class="text-xs tracking-wide text-white/55 uppercase">Старт</p>
							<p class="mt-1 font-semibold">листопад–грудень 2026</p>
						</div>
						<div>
							<p class="text-xs tracking-wide text-white/55 uppercase">Участь</p>
							<p class="mt-1 text-2xl font-bold text-secondary">690 zł</p>
						</div>
					</div>
					<p class="mt-4 text-sm leading-relaxed text-white/60">
						Точний день і час узгодимо після формування групи.
					</p>
				</div>
			</div>
		</div>
	</section>
{/if}
