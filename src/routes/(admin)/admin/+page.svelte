<script lang="ts">
	import { PATHS } from './model';
	import { translate } from '$i18n';
</script>

<div class="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md">
	<h1 class="mb-5 text-3xl font-bold text-gray-800">
		{$translate('admin.availableResources')}
	</h1>

	<ul class="space-y-2">
		{#each PATHS as { href, label, description } (href)}
			<li>
				<a
					{href}
					class="block rounded-lg border-2 border-gray-500 px-4 py-2 text-xl
                 font-bold text-gray-700
                 transition-colors duration-150 ease-in-out
                 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
				>
					<div class="flex items-center">
						<div>
							<h3>
								{$translate(label)}
							</h3>

							<small>{$translate(description)}</small>
						</div>

						<span class="flex-auto"></span>

						<i class="fa-solid fa-arrow-right"></i>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>
