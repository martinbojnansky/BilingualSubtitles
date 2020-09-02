import { ISubtitles, ITimedTextEvent } from 'src/shared/interfaces';

export abstract class ISubtitlesParserService {
  abstract parse(
    sEvents: ITimedTextEvent[],
    tEvents: ITimedTextEvent[]
  ): ISubtitles;
}

// Basic subtitles parser which relies on the same count of the events.
export class SubtitlesParserService implements ISubtitlesParserService {
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
        ?.map((s) => s.utf8)
        ?.join('')
        ?.trim();
      subtitles[key] = {
        key: key,
        startMs: tEvent?.tStartMs,
        durationMs: tEvent?.dDurationMs,
        sLangLines: sEvent?.segs?.map((s) => s.utf8.replace('\n', ' ')),
        tLangLines: tEvent?.segs?.map((s) => s.utf8),
      };
    }

    return subtitles;
  }
}

// Improved subtitles parses which does not rely on the same count of the events
// and supports auto-generated subtitles.
export class CCSubtitlesParserService implements ISubtitlesParserService {
  public parse(
    sEvents: ITimedTextEvent[],
    tEvents: ITimedTextEvent[]
  ): ISubtitles {
    const subtitles: ISubtitles = {};
    // Itterates target language events which usually groups
    // multiple auto-generated subtitles.
    for (let i = 0; i < tEvents?.length; i++) {
      // Get current and next target events
      const tEvent = tEvents[i];
      const tNextEvent = tEvents[i + 1];
      // Find start and end index of source events
      // in order to match target event with multiple source events.
      const sEventsGroupStartIndex = sEvents.findIndex(
        (e) => e.tStartMs === tEvent.tStartMs
      );
      let sEventsGroupEndIndex = sEvents.findIndex(
        (e) => e.tStartMs === tNextEvent?.tStartMs
      );
      sEventsGroupEndIndex =
        sEventsGroupEndIndex === -1 ? sEvents.length : sEventsGroupEndIndex;

      const sEvent: ITimedTextEvent = {
        tStartMs: tEvent?.tStartMs,
        dDurationMs: tEvent?.dDurationMs,
        segs: [{ utf8: '' }],
      };
      for (let j = sEventsGroupStartIndex; j < sEventsGroupEndIndex; j++) {
        sEvent.segs[0].utf8 += sEvents[j]?.segs
          ?.map((s) => s.utf8.replace(/ +?/, '')?.replace('\n', ' '))
          ?.join(' ');
      }
      // Set subtitle based on target event key.
      const key = tEvent?.segs
        ?.map((s) => s.utf8)
        ?.join('')
        ?.trim();
      subtitles[key] = {
        key: key,
        startMs: tEvent.tStartMs,
        durationMs: tEvent.dDurationMs,
        sLangLines: sEvent.segs?.map((s) => s.utf8.trim()),
        tLangLines: tEvent.segs?.map((s) => s.utf8),
      };
    }

    return subtitles;
  }
}
