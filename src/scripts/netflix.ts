import {
  injectWebAccessibleResource,
  onMessage,
  onDocumentMessage,
} from './shared/extension-helpers';
import { Action } from 'src/shared/actions';
import { NetflixService, INetflixService } from './netflix/netflix.service';
import { ISubtitles } from 'src/shared/interfaces';

injectWebAccessibleResource('script', 'runtime.js');
injectWebAccessibleResource('script', 'netflixInterceptor.js');
injectWebAccessibleResource('script', 'polyfills.js');
injectWebAccessibleResource('script', 'styles.js');
injectWebAccessibleResource('script', 'vendor.js');

const netflixService: INetflixService = new NetflixService();

// Pass subtitles to the service once the interceptor has parsed new ones.
onDocumentMessage(Action.subtitlesParsed, (subtitles: ISubtitles) => {
  netflixService.setSubtitles(subtitles);
});

// Listens to messages from extension.
onMessage((m) => {});
