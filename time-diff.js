import fecha from 'fecha';

export default function() {
  let format = {
    future : 'in %s',
    past   : '%s ago',
    n  : 'just now',
    s  : 'a few seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
  }

  class TimeDiff extends HTMLElement {
    static get observedAttributes() {
      return ['datetime'];
    }

    connectedCallback() {
      this._time = document.createElement('time');
      this.appendChild(this._time);

      if (this.getAttribute('datetime') === null) {
        this.datetime = 'now';
      }
    }

    disconnectedCallback() {
      if (this._timer) {
        clearTimeout(this._timer);
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      this[name] = newValue;
    }

    get datetime() { return this._datetime; }
    set datetime(value) {
      this._datetime = (!value || value === 'now') ? this.nowUTC() : new Date(value);
      this.setAttribute('title', fecha.format(this._datetime, 'ddd, MMM D YYYY, hh:mm:ss'));
      this.setAttribute('datetime', this._datetime.toISOString());
      this.nextTick();
    }

    nextTick() {
      var delay = this.humanize(this._datetime, this.nowUTC());
      this._timer = setTimeout(this.nextTick.bind(this), delay * 1000);
    }

    humanize(from, to) {
      var thresholds = {
        n: 6,   // now
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
      };
      var diff = from - to;
      var round = Math.round;
      var seconds = round(Math.abs(diff) / 1000);
      var minutes = round(seconds / 60);
      var hours = round(minutes / 60);
      var days = round(hours / 24);
      var months = round(days * 4800 / 146097);
      var years = round(days / 365);

      var a = seconds < thresholds.n && ['n']           ||
              seconds < thresholds.s && ['s', seconds]  ||
              minutes <= 1           && ['m']           ||
              minutes < thresholds.m && ['mm', minutes] ||
              hours   <= 1           && ['h']           ||
              hours   < thresholds.h && ['hh', hours]   ||
              days    <= 1           && ['d']           ||
              days    < thresholds.d && ['dd', days]    ||
              months  <= 1           && ['M']           ||
              months  < thresholds.M && ['MM', months]  ||
              years   <= 1           && ['y']           || ['yy', years];

      if (seconds < thresholds.n) {
        this._time.innerText = format[a[0]];
      } else {
        var type = (diff < 0) ? 'past' : 'future';
        this._time.innerText = format[type].replace(/%s/, format[a[0]].replace(/%d/, a[1]));
      }

      diff = Math.abs(diff) / 1000;
      if (diff < 1) {
        return 1;
      } else if (diff < 30) {
        return 5;
      } else if (diff < 60) {
        return 10;
      } else if (diff < 180) {
        return 30;
      } else if (diff < 300) {
        return 60;
      } else if (diff < 3600) {
        return 300;
      } else {
        return 3600;
      }
    }

    nowUTC() {
      var now = new Date();
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
    }
  }

  window.customElements.define('time-diff', TimeDiff);
}
