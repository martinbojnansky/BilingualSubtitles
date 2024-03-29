import { ISubtitles, ISubtitle } from 'src/shared/interfaces';
import { MutationObserverService } from '../shared/mutation-observer.service';
import { Store } from '../shared/store';

export interface IYoutubeServiceState {
  subtitles: ISubtitles;
  baseStyle: string;
}

export abstract class IYoutubeService extends MutationObserverService {
  abstract setSubtitles(subtitles: ISubtitles): void;
}

export class YoutubeService extends IYoutubeService {
  // #region properties-definition

  // Gets object that contains single source of thruth (state).
  protected readonly store = new Store<IYoutubeServiceState>({});

  // Gets or sets <style> element used to modify current visual styles.
  protected style: HTMLStyleElement;

  // #endregion

  // #region general

  // Called when interceptor has parsed the subtitles.
  public setSubtitles(subtitles: ISubtitles) {
    this.store.patch({ subtitles: subtitles });
    this.createSubtitlesStyleElement();
  }

  // Called when any element is added to the page.
  protected onNodeAdded = (node: Node, key: number, parent: NodeList) => {
    try {
      const div = node as HTMLDivElement;
      // Listens to add of subtitle element.
      if (div.classList.contains('caption-window')) {
        this.onSubtitleDisplayed(node.textContent);
      }
    } catch {}
  };

  // #endregion

  // #region processing

  // Either renders translation of subtitle matched by provided key and translates upcoming one,
  // or translates current if a translation is missing (can happen on seek).
  protected onSubtitleDisplayed(key: string): void {
    try {
      const subtitle = this.store.state.subtitles[key.trim()];
      this.showSubtitleTranslation(subtitle);
    } catch {
      this.clearSubtitlesStyle();
    }
  }

  // Shows subtitle translation by updating CSS style.
  protected showSubtitleTranslation(subtitle: ISubtitle): void {
    this.updateSubtitlesStyle(subtitle);
  }

  // #endregion

  // #region rendering

  // Creates <style> element that modifies CSS styles of
  // displayed subtitles.
  protected createSubtitlesStyleElement(): void {
    if (!this.style) {
      this.style = document.createElement('style');
      this.style.type = 'text/css';
      document.head.insertAdjacentElement('beforeend', this.style);
    }

    // If new subtitles were loaded, new base style has to be generated.
    this.updateSubtitlesBaseStyle();
    // Try to display translation of currently displayed subtitle,
    // because observer will update only if there is a modification.
    this.onSubtitleDisplayed(
      document.querySelector('.caption-window.ytp-caption-window-bottom')
        ?.textContent
    );
  }

  // Updates state of base style which changes only with change
  // of language or video.
  protected updateSubtitlesBaseStyle(): void {
    this.store.patch({
      baseStyle:
        `
        .caption-window {
          width: auto !important;
        }
      
        .caption-visual-line .ytp-caption-segment::before {
          display: block;
          color: yellow;
        }
    ` + this.getTranscriptStyle(this.store.state.subtitles),
    });
  }

  // Gets CSS style for transcript list.
  protected getTranscriptStyle(subtitles: ISubtitles): string {
    let transcriptStyle = `
      .cue.style-scope.ytd-transcript-body-renderer::after {
        display: block;
        opacity: 0.8;
      }
    `;

    Object.keys(subtitles).forEach((key) => {
      const subtitle = subtitles[key];
      transcriptStyle += `
      .cue.style-scope.ytd-transcript-body-renderer[start-offset="${
        subtitle.startMs
      }"]::after {
        content: '${subtitle.tLangLines
          .join(' ')
          .replace("'", "\\'")
          .replace('\n', ' ')}';
      }
      `;
    });

    return transcriptStyle;
  }

  // Updates content of <style> element that modifies CSS styles
  // of displayed subtitles.
  protected updateSubtitlesStyle(subtitle: ISubtitle): void {
    // Displays source language subtitles line by line (as pseudo-elements) and differentiate with color.
    let css = this.store.state.baseStyle;
    // Add style for each line.
    subtitle.sLangLines.forEach((line, index) => {
      css += this.getSubtitleSourceStyle(index + 1, line);
    });

    // Apply new css style.
    this.style.innerHTML = css;
  }

  // Gets CSS style for original subtitle considering the line index.
  protected getSubtitleSourceStyle(index: number, content: string): string {
    return `
      .caption-visual-line .ytp-caption-segment:nth-child(${index})::before {
        content: '${content.replace("'", "\\'").replace('\n', ' ')}';
      }`;
  }

  // Clears content of <style> element that modifies CSS styles
  // of displayed subtitles.
  protected clearSubtitlesStyle(): void {
    this.style.innerHTML = '';
  }

  //#endregion
}
