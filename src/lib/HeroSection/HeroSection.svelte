<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/Button/Button.svelte';
</script>

<div
	class="flex h-96 flex-col items-center justify-center bg-cover bg-center text-primary"
	style={`background-image: url(${asset('assets/hero-image.jpg')});`}
>
	<div class="text-center text-5xl text-balance">Znajdź spokój i równowagę w swoim życiu</div>
	<div class="mt-3 text-center text-xl">Profesjonalna psychoterapia z empatią i zrozumieniem</div>
	<Button tailwind="w-auto mt-3 p-3" href="#contact">Skontaktuj się ze mną</Button>
</div>
