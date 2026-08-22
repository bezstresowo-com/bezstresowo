/** Reads a `File`/`Blob` as a bare base64 string (no `data:` prefix). */
export async function toBase64(file: Blob): Promise<string> {
	const buffer = await file.arrayBuffer();
	const bytes = new Uint8Array(buffer);

	let binary = '';
	const CHUNK_SIZE = 0x8000;
	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
	}

	return btoa(binary);
}
