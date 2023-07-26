import S3 from 'aws-sdk/clients/s3';

export default async function handler(req, res) {
  const s3 = new S3({
    signatureVersion: 'v4',
    region: process.env.S3_BUCKET_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  try {
    const preSignedUrl = s3.getSignedUrl('putObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.query.file,
      ContentType: req.query.fileType,
      Expires: 5 * 60,
    });

    const s3FileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${req.query.file}`;

    res.status(200).json({
      preSignedUrl: preSignedUrl,
      imgUrl: s3FileUrl,
    });
  } catch (error) {
    console.log(`Error - ${error.code}: ${error.message}`);
    res.status(400).json({ message: 'Bad Request' });
  }
}
