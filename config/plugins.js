module.exports = ({ env }) => {
  if (env("NODE_ENV") !== "production") {
    return {
      upload: {
        providerOptions: {
          localServer: {},
        },
      },
    };
  }

  return {
    upload: {
      provider: "s3-cloudfront",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
        region: env("AWS_REGION"),
        params: {
          Bucket: env("AWS_BUCKET"),
        },
        cdn: env("CLOUDFRONT"),
      },
    },
  };
};
