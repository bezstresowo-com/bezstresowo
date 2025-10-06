import {
	AWS_S3_ACCESS_KEY_ID,
	AWS_S3_BUCKET_NAME,
	AWS_S3_REGION,
	AWS_S3_SECRET_ACCESS_KEY
} from '$env/static/private';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class S3Service {
	private readonly _s3;

	constructor() {
		this._s3 = new S3Client({
			region: AWS_S3_REGION,
			credentials: {
				accessKeyId: AWS_S3_ACCESS_KEY_ID,
				secretAccessKey: AWS_S3_SECRET_ACCESS_KEY
			}
		});
	}

	async uploadFile(
		file: Buffer,
		fileName: string,
		mimetype: string
	) {
		const command = new PutObjectCommand({
			Bucket: AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: file,
			ContentType: mimetype
		});

		await this._s3.send(command);

		const url = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${fileName}`;
		return { url };
	}

	async deleteFile(fileName: string) {
		const command = new DeleteObjectCommand({
			Bucket: AWS_S3_BUCKET_NAME,
			Key: fileName
		});

		await this._s3.send(command);
	}
}
