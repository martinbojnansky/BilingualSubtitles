import { ISubtitles, ISubtitle } from 'src/shared/interfaces';
import { MutationObserverService } from '../shared/mutation-observer.service';
import { Store } from '../shared/store';

export interface IYoutubeServiceState {
  subtitles: ISubtitles;
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
    } catch {}
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
  }

  // Updates content of <style> element that modifies CSS styles
  // of displayed subtitles.
  protected updateSubtitlesStyle(subtitle: ISubtitle): void {
    // Displays source language subtitles line by line (as pseudo-elements) and differentiate with color.
    let css = `
      .caption-window {
        width: auto !important;
      }
    
      .caption-visual-line .ytp-caption-segment::before {
        display: block;
        color: yellow;
      }
    `;
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

  //#endregion
}
