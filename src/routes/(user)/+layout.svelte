<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen w-full">
	<header class="fixed top-0 left-0 w-full bg-primary p-4">
		<div class="mx-auto flex max-w-[1280px] items-center gap-2">
			<span class="text-2xl font-bold text-accent">Bezstresowo</span>
		</div>
	</header>

	<main class="content bg-stone-100 p-4">
		<div class="mx-auto max-w-[1280px]">
			{@render children?.()}
		</div>
	</main>

	<footer class="bg-primary p-4 text-accent">
		<div class="mx-auto flex max-w-[1280px] items-center gap-2">
			<div class="max-w-60">
				<p>Centrum Psychoterapii Bezstresowo OLESYA HAIDUK</p>
			</div>

			<div class="max-w-60">
				<p>
					<span class="font-bold"> NIP: </span>
					7282877722
				</p>
				<p><span class="font-bold">REGON:</span> 526600299</p>
			</div>

			<div class="max-w-60">
				<p><span class="font-bold">Tel.:</span> <a href="tel:+48795819910">+48795819910</a></p>
				<p>
					<span class="font-bold">E-mail:</span>
					<a href="mailto:beztresowo@gmail.com">beztresowo@gmail.com</a>
				</p>
			</div>

			<span class="flex-auto"></span>
		</div>
	</footer>
</div>

<style lang="css">
	:root {
		--user-header-height: calc(var(--spacing) * 16);
		--user-footer-height: calc(var(--spacing) * 4);
	}

	.content {
		margin-top: var(--user-header-height);
		min-height: calc(100dvh - var(--user-header-height) - var(--user-footer-height));
	}
</style>
