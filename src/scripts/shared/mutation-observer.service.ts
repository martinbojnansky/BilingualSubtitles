export abstract class MutationObserverService {
  protected observer: MutationObserver;

  constructor() {
    this.onInit();
  }

  protected onInit(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (this.onNodeAdded) {
          mutation.addedNodes.forEach((value, key, parent) =>
            this.onNodeAdded(value, key, parent)
          );
        }
      });
    });

    this.observer.observe(document, {
      childList: true,
      subtree: true,
    });
  }

  protected onNodeAdded: (node: Node, key: number, parent: NodeList) => void;
}
