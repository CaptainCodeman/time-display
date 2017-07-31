import fecha from 'fecha';

export default function() {
  class TimeDisplay extends HTMLElement {
    static get observedAttributes() {
      return ['datetime', 'format'];
    }

    constructor() {
      super();
      this._time = document.createElement('time');
      this.appendChild(this._time);
    }

    connectedCallback() {
      if (this.getAttribute('datetime') === null) {
        this.datetime = 'now';
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      this[name] = newValue;
    }

    get datetime() { return this._datetime; }
    set datetime(value) {
      this._datetime = (!value || value === 'now') ? this.nowUTC() : new Date(value);
      this.render();
      this.setAttribute('datetime', this._datetime.toISOString());
    }

    get format() { return this._format; }
    set format(value) {
      this._format = value;
      this.render();
      this.setAttribute('format', value);
    }

    render() {
      if (!this._datetime || !this._format) return;
      this._time.innerText = fecha.format(this._datetime, this._format);
    }

    nowUTC() {
      var now = new Date();
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
    }
  }

  window.customElements.define('time-display', TimeDisplay);
}
