import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { action, value } = await request.json();

	try {
		if (action === 'encode') {
			const buffer = Buffer.from(value, 'utf8');
			const encoded = buffer.toString('base64');
			return json({ result: encoded });
		} else if (action === 'decode') {
			const buffer = Buffer.from(value, 'base64');
			const decoded = buffer.toString('utf8');
			return json({ result: decoded });
		} else {
			return json({ error: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		console.error('Base64 processing error:', error);
		return json({ error: 'Invalid base64 input' }, { status: 400 });
	}
};
