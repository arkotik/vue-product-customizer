export default class EditorHistory {
  #maxSize = 50;
  #history = [];
  #cursor = 0;
  constructor(maxSize = 50) {
    this.#maxSize = Math.max(maxSize, 1);
  }
  pushState = (state) => {
    const pos = this.#cursor + 1;
    if (pos >= this.#maxSize) {
      this.#history.shift();
    }
    const del = Math.min(this.#maxSize, this.#history.length) - pos;
    this.#history.splice(pos, del, state);
    this.#cursor = this.#history.length - 1;
  }
  back = () => {
    if (this.#cursor - 1 < 0) {
      return void 0;
    }
    this.#cursor -= 1;
    return this.#history[this.#cursor];
  };
  forward = () => {
    if (this.#cursor + 1 === this.#history.length) {
      return void 0;
    }
    this.#cursor += 1;
    return this.#history[this.#cursor];
  };
  go = (delta) => {
    let pos = this.#cursor + delta;
    if (pos < 0) {
      pos = 0;
    }
    if (pos >= this.#history.length) {
      pos = this.#history.length - 1;
    }
    this.#cursor = pos;
    return this.#history[this.#cursor];
  };
  get position() {
    return this.#cursor;
  }
  get length() {
    return this.#history.length;
  }
}
