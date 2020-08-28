import { Action } from 'src/shared/actions';
import { IMessage } from 'src/shared/interfaces';
import { environment } from 'src/environments/environment';

// Appends extension resource to HTML body element as HTML element.
export const injectWebAccessibleResource = <
  T extends keyof HTMLElementTagNameMap
>(
  tag: T,
  path: string
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(tag);
  element['src'] = chrome.runtime.getURL(path);
  document.body.appendChild(element);
  return element;
};

// Appends HTML element to HTML target element.
export const injectElement = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  target: HTMLElement,
  beforeRendering: (element: HTMLElementTagNameMap[T]) => void = (e) => {}
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(tag);
  beforeRendering(element);
  target.appendChild(element);
  return element;
};

// Sends extension message.
export const sendMessage = <T>(action: Action, payload: T) => {
  const message = { action: action, payload: payload } as IMessage<T>;
  chrome.runtime.sendMessage(message);
  if (!environment.production) {
    console.log('Extension message sent: ', message);
  }
};

// Listens for extension message.
export const onMessage = <T>(
  callback: (message: IMessage<T>) => void
): void => {
  chrome.runtime.onMessage.addListener((message) => {
    callback(message);
    if (!environment.production) {
      console.log('Extension message received: ', message);
    }
  });
};

// Sends HTML document message.
export const sendDocumentMessage = <T>(action: Action, payload?: T) => {
  document.dispatchEvent(
    new CustomEvent(action, {
      detail: payload,
    })
  );
  if (!environment.production) {
    console.log('Document message sent: ', { action, payload });
  }
};

// Listens for HTML document message.
export const onDocumentMessage = <T>(
  action: Action,
  callback: (payload: T) => void
): void => {
  document.addEventListener(action, (e: CustomEventInit<Document>) => {
    callback((e?.detail as unknown) as T);
    if (!environment.production) {
      console.log('Document message received: ', {
        action,
        payload: e?.detail,
      });
    }
  });
};

// Evaluates lambda expression with try/catch block and returns fallback value.
export function trySafe<T>(fce: () => T, failResult: T = null): T {
  try {
    const result = fce();
    return result ? result : null;
  } catch {
    return failResult;
  }
}

// Creates key out of the provided text in order to match
// values even if they are somehow displayed with trailing characters
export function textToKey(value: string): string {
  return value.trim();
}
