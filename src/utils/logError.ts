import * as Sentry from "@sentry/react";
export const logError = (msg: string, err: unknown) => {
  console.error(msg, err);
  Sentry.captureException(err, {
  tags: { location: msg },
  extra: { originalMessage: msg },
});
};
