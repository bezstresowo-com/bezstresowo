<script lang="ts">
	import { translate } from '$i18n';
	import { REVIEWS } from './reviews';
</script>

<section class="bg-white text-secondary pt-20">
	<div class="grid bg-primary px-4 pb-4 min-[1170px]:rounded-xl">
		<div class="px-4 pt-12 pb-8 text-center">
			<h1 class="text-3xl sm:text-4xl">Customer Reviews</h1>
		</div>
		<div class="flex gap-3 px-4 pb-20 max-lg:flex-col">
			{#each REVIEWS as { customer, rating, comment }}
				<div
					class="flex flex-1 flex-col items-center justify-center gap-5 p-6 rounded-lg border border-secondary bg-white/10"
				>
					<div class="flex w-full">
						{#each { length: rating } as _, i}
							<i class="fa-solid fa-star text-xl text-accent" aria-hidden="true"></i>
						{/each}
						{#each { length: 5 - rating } as _, i}
							<i class="fa-regular fa-star text-xl text-accent" aria-hidden="true"></i>
						{/each}
					</div>
					<div class="w-full text-left text-white/80 italic">{$translate(comment)}</div>
					<div class="w-full text-left">- {customer}</div>
				</div>
			{/each}
		</div>
	</div>
</section>
