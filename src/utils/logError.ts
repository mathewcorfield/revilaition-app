import * as Sentry from "@sentry/react";
export const logError = (msg: string | null, err: unknown | null) => {
  if (!msg || !err) {
    msg = "logError was passed null inputs";
    Sentry.captureException(msg, {
      tags: { location: msg },
      extra: { originalMessage: msg },
    });
    return;
  }

  console.error(msg, err);

  Sentry.captureException(err, {
    tags: { location: msg },
    extra: { originalMessage: msg },
  });
};
