import { redirect } from '@sveltejs/kit';
export const load = ({ params }) => {
	if (params.lang !== 'pl') redirect(307, '/uk/materials/koly-dumky-ne-daiut-spokoiu');
	return {};
};
