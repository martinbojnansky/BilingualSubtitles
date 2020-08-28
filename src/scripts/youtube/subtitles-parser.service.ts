import { ISubtitles, ITimedTextEvent } from 'src/shared/interfaces';

export class SubtitlesParserService {
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
