import { TestBed } from '@angular/core/testing';
import {
  CCSubtitlesParserService,
  ISubtitlesParserService,
  SubtitlesParserService,
} from './subtitles-parser.service';
import { ITimedTextEvent } from 'src/shared/interfaces';

describe('SubtitlesParserService', () => {
  let service: ISubtitlesParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ISubtitlesParserService,
          useClass: SubtitlesParserService,
        },
      ],
    });
    service = TestBed.inject(ISubtitlesParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse auto-generated cc subtitles', () => {
    // Subtitles from https://www.youtube.com/watch?v=e-Oyu0oKcXY
    const sEvents: ITimedTextEvent[] = [
      {
        tStartMs: 7880,
        dDurationMs: 5200,
        segs: [
          {
            utf8:
              'Der Nebel kommt. Es sieht so aus,\nals ob wir uns beeilen müssten.',
          },
        ],
      },
      {
        tStartMs: 14640,
        dDurationMs: 2000,
        segs: [
          {
            utf8: 'Es ist nicht so schlimm.',
          },
        ],
      },
      {
        tStartMs: 16880,
        dDurationMs: 3160,
        segs: [
          {
            utf8: '5.30 Uhr auf der Basis\nder Air Zermatt.',
          },
        ],
      },
    ];
    const tEvents: ITimedTextEvent[] = [
      {
        tStartMs: 7880,
        dDurationMs: 5200,
        segs: [
          {
            utf8: ' The fog is coming. It looks like we have to hurry. ',
          },
        ],
      },
      {
        tStartMs: 14640,
        dDurationMs: 2000,
        segs: [
          {
            utf8: ' It is not so bad. ',
          },
        ],
      },
      {
        tStartMs: 16880,
        dDurationMs: 3160,
        segs: [
          {
            utf8: ' 5.30 a.m. on the basis of Air Zermatt. ',
          },
        ],
      },
    ];

    const subtitles = service.parse(sEvents, tEvents);
    expect(subtitles).toEqual({
      'The fog is coming. It looks like we have to hurry.': {
        key: 'The fog is coming. It looks like we have to hurry.',
        startMs: 7880,
        durationMs: 5200,
        sLangLines: [
          'Der Nebel kommt. Es sieht so aus, als ob wir uns beeilen müssten.',
        ],
        tLangLines: [' The fog is coming. It looks like we have to hurry. '],
      },
      'It is not so bad.': {
        key: 'It is not so bad.',
        startMs: 14640,
        durationMs: 2000,
        sLangLines: ['Es ist nicht so schlimm.'],
        tLangLines: [' It is not so bad. '],
      },
      '5.30 a.m. on the basis of Air Zermatt.': {
        key: '5.30 a.m. on the basis of Air Zermatt.',
        startMs: 16880,
        durationMs: 3160,
        sLangLines: ['5.30 Uhr auf der Basis der Air Zermatt.'],
        tLangLines: [' 5.30 a.m. on the basis of Air Zermatt. '],
      },
    });
  });
});

describe('CCSubtitlesParserService', () => {
  let service: ISubtitlesParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ISubtitlesParserService,
          useClass: CCSubtitlesParserService,
        },
      ],
    });
    service = TestBed.inject(ISubtitlesParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse auto-generated cc subtitles', () => {
    // Subtitles from https://www.youtube.com/watch?v=jUOvnHOsvXM
    const sEvents: ITimedTextEvent[] = [
      {
        tStartMs: 0,
        dDurationMs: 296230,
        segs: undefined,
      },
      {
        tStartMs: 380,
        dDurationMs: 4000,
        segs: [
          {
            utf8: 'janisch',
          },
          {
            utf8: ' walter',
          },
          {
            utf8: ' und',
          },
          {
            utf8: ' ich',
          },
          {
            utf8: ' sind',
          },
          {
            utf8: ' heute',
          },
          {
            utf8: ' in',
          },
        ],
      },
      {
        tStartMs: 3649,
        dDurationMs: 731,
        segs: [
          {
            utf8: '\n',
          },
        ],
      },
      {
        tStartMs: 3659,
        dDurationMs: 3930,
        segs: [
          {
            utf8: 'berlin',
          },
        ],
      },
      {
        tStartMs: 4370,
        dDurationMs: 3219,
        segs: [
          {
            utf8: '\n',
          },
        ],
      },
      {
        tStartMs: 4380,
        dDurationMs: 6030,
        segs: [
          {
            utf8: 'wir',
          },
          {
            utf8: ' wollen',
          },
          {
            utf8: ' euch',
          },
          {
            utf8: ' zeigen',
          },
          {
            utf8: ' wie',
          },
          {
            utf8: ' man',
          },
          {
            utf8: ' in',
          },
          {
            utf8: ' einem',
          },
        ],
      },
      {
        tStartMs: 7579,
        dDurationMs: 2831,
        segs: [
          {
            utf8: '\n',
          },
        ],
      },
      {
        tStartMs: 7589,
        dDurationMs: 5871,
        segs: [
          {
            utf8: 'deutschen',
          },
          {
            utf8: ' kaffee',
          },
          {
            utf8: ' einen',
          },
          {
            utf8: ' kaffee',
          },
          {
            utf8: ' bestellt',
          },
        ],
      },
      {
        tStartMs: 10400,
        dDurationMs: 3060,
        segs: [
          {
            utf8: '\n',
          },
        ],
      },
    ];
    const tEvents: ITimedTextEvent[] = [
      {
        tStartMs: 380,
        dDurationMs: 4000,
        segs: [
          {
            utf8: ' janisch walter and i are in berlin today ',
          },
        ],
      },
      {
        tStartMs: 4380,
        dDurationMs: 6030,
        segs: [
          {
            utf8:
              ' we want to show you how to order a coffee in a german coffee shop ',
          },
        ],
      },
    ];

    const subtitles = service.parse(sEvents, tEvents);
    expect(subtitles).toEqual({
      'janisch walter and i are in berlin today': {
        key: 'janisch walter and i are in berlin today',
        startMs: 380,
        durationMs: 4000,
        sLangLines: ['janisch walter und ich sind heute in berlin'],
        tLangLines: [' janisch walter and i are in berlin today '],
      },
      'we want to show you how to order a coffee in a german coffee shop': {
        key:
          'we want to show you how to order a coffee in a german coffee shop',
        startMs: 4380,
        durationMs: 6030,
        sLangLines: [
          'wir wollen euch zeigen wie man in einem deutschen kaffee einen kaffee bestellt',
        ],
        tLangLines: [
          ' we want to show you how to order a coffee in a german coffee shop ',
        ],
      },
    });
  });
});
