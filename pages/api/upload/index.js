import S3 from 'aws-sdk/clients/s3';

export default async function handler(req, res) {
  console.log('REq', req.body);
  const s3 = new S3({
    signatureVersion: 'v4',
    region: process.env.S3_BUCKET_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  const preSignedUrl = await s3.getSignedUrl('putObject', {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: req.query.file,
    ContentType: req.query.fileType,
    Expires: 5 * 60,
  });

  const s3FileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${req.query.file}`;
  console.log('File URL', s3FileUrl);

  res.status(200).json({
    url: preSignedUrl,
    imgurl: s3FileUrl,
  });
}
