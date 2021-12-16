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
        params: {
          Bucket: env("AWS_BUCKET"),
        },
        cdn: env("CLOUDFRONT"),
      },
    },
  };
};
