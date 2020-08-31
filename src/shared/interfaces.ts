import { Action } from './actions';

export interface IMessage<T> {
  action: Action;
  payload: T;
}

export interface ISubtitle {
  key: string;
  startMs: number;
  durationMs: number;
  sLangLines: string[];
  tLangLines: string[];
}

export interface ISubtitles {
  [key: string]: ISubtitle;
}

export interface ITimedTextEvent {
  tStartMs: number;
  dDurationMs: number;
  segs: { utf8: string }[];
  wpWinPosId?: number;
}

export interface ITimedTextResponse {
  events: ITimedTextEvent[];
}
