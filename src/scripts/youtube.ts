import {
  injectWebAccessibleResource,
  onMessage,
  onDocumentMessage,
} from './shared/extension-helpers';
import { Action } from 'src/shared/actions';
import { YoutubeService, IYoutubeService } from './youtube/youtube.service';
import { ISubtitles } from 'src/shared/interfaces';

injectWebAccessibleResource('script', 'runtime.js');
injectWebAccessibleResource('script', 'youtubeInterceptor.js');
injectWebAccessibleResource('script', 'polyfills.js');
injectWebAccessibleResource('script', 'styles.js');
injectWebAccessibleResource('script', 'vendor.js');

const youtubeService: IYoutubeService = new YoutubeService();

// Pass subtitles to the service once the interceptor has parsed new ones.
onDocumentMessage(Action.subtitlesParsed, (subtitles: ISubtitles) => {
  youtubeService.setSubtitles(subtitles);
});

// Listens to messages from extension.
onMessage((m) => {});
