import fecha from 'fecha';

export default function() {
  class TimeDisplay extends HTMLElement {
    connectedCallback() {
      var datetime = this.getAttribute("datetime");
      var format = this.getAttribute("format");

      datetime = (!datetime || datetime === 'now') ? this.nowUTC() : new Date(datetime);

      var time = document.createElement('time');
      time.setAttribute('datetime', datetime.toISOString());
      time.setAttribute('title', fecha.format(datetime, 'ddd, MMM D YYYY, hh:mm:ss'));
      time.innerText = fecha.format(datetime, format);
      this.appendChild(time);
    }

    nowUTC() {
      var now = new Date();
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
    }
  }

  window.customElements.define('time-display', TimeDisplay);
}
