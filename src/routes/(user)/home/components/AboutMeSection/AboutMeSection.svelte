<script lang="ts">
	import { translate } from '$i18n';
  import aboutMeImage from '$lib/assets/about-me.svg';
</script>

<section>
	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 pt-20 pb-20 lg:grid-cols-2">
		<div class="flex items-center justify-center">
			<img src={aboutMeImage} alt="About Me" class="rounded-lg object-cover" />
		</div>
		<div>
			<h1 class="text-3xl mb-5 text-primary">O mnie</h1>
			<div class="text-sm text-primary/80">
				<p>{$translate("user.pages.home.aboutMe.myNameIs")}</p>
				<p>{$translate("user.pages.home.aboutMe.description")}</p>
			</div>
		</div>
	</div>
</section>
