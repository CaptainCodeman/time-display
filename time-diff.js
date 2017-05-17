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
    connectedCallback() {
      var datetime = this.getAttribute("datetime");
      this.datetime = (!datetime || datetime === 'now') ? this.nowUTC() : new Date(datetime);
      this.time = document.createElement('time');
      this.time.setAttribute('datetime', this.datetime.toISOString());
      this.time.setAttribute('title', fecha.format(this.datetime, 'ddd, MMM D YYYY, hh:mm:ss'));
      this.appendChild(this.time);
      this.nextTick();
    }

    disconnectedCallback() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    }

    nextTick() {
      var delay = this.humanize(this.datetime, this.nowUTC());
      this.timer = setTimeout(this.nextTick.bind(this), delay * 1000);
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
        this.time.innerText = format[a[0]];
      } else {
        var type = (diff < 0) ? 'past' : 'future';
        this.time.innerText = format[type].replace(/%s/, format[a[0]].replace(/%d/, a[1]));
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
