<script lang="ts">
	import { translate } from '$i18n';
	import { asset } from '$app/paths';
</script>

<section class="pt-20 max-xl:px-4">
	<div class="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="flex items-center justify-center">
			<img src={asset('assets/about-me.jpg')} alt="About Me" class="rounded-lg object-cover" />
		</div>
		<div>
			<h1 class="mb-5 text-3xl text-primary">{$translate('user.pages.home.aboutMe.title')}</h1>
			<div class="text-sm text-primary/80">
				<p>{$translate('user.pages.home.aboutMe.myNameIs')}</p>
				<p>{$translate('user.pages.home.aboutMe.description')}</p>
			</div>
		</div>
	</div>
</section>
