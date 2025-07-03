export async function encodeBase64(value: string): Promise<string> {
	const response = await fetch('/api/base64', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ action: 'encode', value })
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || 'Failed to encode');
	}

	return data.result;
}

export async function decodeBase64(value: string): Promise<string> {
	const response = await fetch('/api/base64', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ action: 'decode', value })
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || 'Failed to decode');
	}

	return data.result;
}
