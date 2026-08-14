import {
	AWS_S3_ACCESS_KEY_ID,
	AWS_S3_BUCKET_NAME,
	AWS_S3_ENDPOINT,
	AWS_S3_REGION,
	AWS_S3_SECRET_ACCESS_KEY
} from '$env/static/private';
import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';

export type BucketObject = {
	key: string;
	lastModified: Date | null;
	size: number;
};

export class S3Service {
	private readonly _s3;

	constructor() {
		this._s3 = new S3Client({
			region: AWS_S3_REGION,
			credentials: {
				accessKeyId: AWS_S3_ACCESS_KEY_ID,
				secretAccessKey: AWS_S3_SECRET_ACCESS_KEY
			},
			// A custom endpoint (e.g. local MinIO) needs path-style addressing.
			...(AWS_S3_ENDPOINT ? { endpoint: AWS_S3_ENDPOINT, forcePathStyle: true } : {})
		});
	}

	buildUrl(fileName: string) {
		return AWS_S3_ENDPOINT
			? `${AWS_S3_ENDPOINT}/${AWS_S3_BUCKET_NAME}/${fileName}`
			: `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${fileName}`;
	}

	async uploadFile(file: Buffer, fileName: string, mimetype: string) {
		const command = new PutObjectCommand({
			Bucket: AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: file,
			ContentType: mimetype
		});

		await this._s3.send(command);

		return { url: this.buildUrl(fileName) };
	}

	async deleteFile(fileName: string) {
		const command = new DeleteObjectCommand({
			Bucket: AWS_S3_BUCKET_NAME,
			Key: fileName
		});

		await this._s3.send(command);
	}

	/** `DeleteObjects` accepts at most 1000 keys per call. */
	async deleteFiles(fileNames: string[]) {
		for (let i = 0; i < fileNames.length; i += 1000) {
			const chunk = fileNames.slice(i, i + 1000);

			if (chunk.length === 0) {
				continue;
			}

			await this._s3.send(
				new DeleteObjectsCommand({
					Bucket: AWS_S3_BUCKET_NAME,
					Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true }
				})
			);
		}
	}

	/** Lists the whole bucket, following continuation tokens. */
	async listAllObjects(): Promise<BucketObject[]> {
		const objects: BucketObject[] = [];
		let continuationToken: string | undefined;

		do {
			const response = await this._s3.send(
				new ListObjectsV2Command({
					Bucket: AWS_S3_BUCKET_NAME,
					ContinuationToken: continuationToken
				})
			);

			for (const object of response.Contents ?? []) {
				if (object.Key) {
					objects.push({
						key: object.Key,
						lastModified: object.LastModified ?? null,
						size: object.Size ?? 0
					});
				}
			}

			continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
		} while (continuationToken);

		return objects;
	}
}
