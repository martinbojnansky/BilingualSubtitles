// Intercepts all HTTP calls in order to find subtitles (TTML document) requested at any time.

import { trySafe, sendDocumentMessage } from './shared/extension-helpers';
import { ITimedTextEvent } from 'src/shared/interfaces';
import {
  ISubtitlesParserService,
  SubtitlesParserService2,
} from './youtube/subtitles-parser.service';
import { Action } from 'src/shared/actions';

// Loaded TTML document is parsed and saved to the state.
const interceptHttpCalls = (): void => {
  const xhrOpen = window.XMLHttpRequest.prototype.open;
  // @ts-ignore
  window.XMLHttpRequest.prototype.open = function (
    method: string,
    url: string,
    async: boolean,
    username?: string | null,
    password?: string | null
  ): void {
    this.addEventListener('load', () => {
      // Filter out call which does not contain subtitles endpoint url.
      if (!url.startsWith('https://www.youtube.com/api/timedtext?')) return;
      // Fetch params from url
      const tLangParam = trySafe(() => url.match(/&tlang=[^&]+/)[0]);
      // Continue only when translated subtitles were fetched.
      if (!tLangParam) return;
      // Fetch original subtitles. This call is done because even if interceptor is
      // injected at the document_start it does not intercept call to fetch subtitles
      // of pre-defined language.
      fetch(url.replace(tLangParam, '')).then((resp) =>
        resp.json().then((source) => {
          // Parse events for source and target language.
          const sLangEvents = source?.events as ITimedTextEvent[];
          const tLangEvents = JSON.parse(this.responseText)
            ?.events as ITimedTextEvent[];
          // Parse subtitles dictionary object.
          const subtitles = (<ISubtitlesParserService>(
            new SubtitlesParserService2()
          )).parse(sLangEvents, tLangEvents);
          // Emit event with the parsed subtitles.
          sendDocumentMessage(Action.subtitlesParsed, subtitles);
        })
      );
    });

    return xhrOpen.apply(this, arguments);
  };
};

interceptHttpCalls();
