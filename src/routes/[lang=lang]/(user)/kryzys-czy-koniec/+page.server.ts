import { redirect } from '@sveltejs/kit';
export const load = ({ params }) => {
	if (params.lang !== 'pl') redirect(307, '/uk/kryza-chy-kinets');
	return {};
};
