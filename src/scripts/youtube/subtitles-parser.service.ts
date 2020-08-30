import { ISubtitles, ITimedTextEvent } from 'src/shared/interfaces';
import { trySafe } from '../shared/extension-helpers';

export interface ISubtitlesParserService {
  parse(sEvents: ITimedTextEvent[], tEvents: ITimedTextEvent[]): ISubtitles;
}

// Basic subtitles parser which relies on the same count of the events.
export class SubtitlesParserService1 implements ISubtitlesParserService {
  public parse(
    sEvents: ITimedTextEvent[],
    tEvents: ITimedTextEvent[]
  ): ISubtitles {
    // TODO: Check and throw errors if lengths of the subtitles are not the same.
    const subtitles: ISubtitles = {};

    for (let i = 0; i < sEvents?.length; i++) {
      const sEvent = sEvents[i];
      const tEvent = tEvents[i];
      const key = tEvent.segs
        .map((s) => s.utf8)
        .join('')
        .trim();
      subtitles[key] = {
        key: key,
        startMs: tEvent.tStartMs,
        durationMs: tEvent.dDurationMs,
        sLangLines: sEvent.segs.map((s) => s.utf8),
        tLangLines: tEvent.segs.map((s) => s.utf8),
      };
    }

    return subtitles;
  }
}

// Improved subtitles parses which does not rely on the same count of the events
// and supports auto-generated subtitles.
export class SubtitlesParserService2 implements ISubtitlesParserService {
  public parse(
    sEvents: ITimedTextEvent[],
    tEvents: ITimedTextEvent[]
  ): ISubtitles {
    const subtitles: ISubtitles = {};

    // Itterates target language events which usually groups
    // multiple auto-generated subtitles.
    for (let i = 0; i < sEvents?.length; i++) {
      const tEvent = tEvents[i];
      const tNextEvent = trySafe(() => tEvents[i + 1]);
      const sEventsGroupStartIndex = sEvents.findIndex(
        (e) => e.tStartMs === tEvent?.tStartMs
      );
      const sEventsGroupEndIndex = sEvents.findIndex(
        (e) => e.tStartMs === tNextEvent?.tStartMs
      );

      const sEvent: ITimedTextEvent = {
        tStartMs: tEvent?.tStartMs,
        dDurationMs: tEvent?.dDurationMs,
        segs: [{ utf8: '' }],
      };
      for (
        let j = sEventsGroupStartIndex;
        j <
        (sEventsGroupEndIndex !== -1
          ? sEventsGroupEndIndex
          : sEvents.length - 1);
        j++
      ) {
        sEvent.segs[0].utf8 += sEvents[j].segs
          .map((s) => s.utf8)
          .join(' ')
          .replace('\n', ' ');
      }

      console.log(
        sEventsGroupStartIndex,
        sEventsGroupEndIndex,
        sEvent,
        tEvent,
        tNextEvent
      );

      const key = tEvent.segs
        .map((s) => s.utf8)
        .join('')
        .trim();
      subtitles[key] = {
        key: key,
        startMs: tEvent.tStartMs,
        durationMs: tEvent.dDurationMs,
        sLangLines: sEvent.segs.map((s) => s.utf8),
        tLangLines: tEvent.segs.map((s) => s.utf8),
      };
    }

    return subtitles;
  }
}
