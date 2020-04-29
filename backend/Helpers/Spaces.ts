import aws from "aws-sdk";

export const space = new aws.S3({
  endpoint: "nyc3.digitaloceanspaces.com",
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});
