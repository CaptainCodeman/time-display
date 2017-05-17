import timeDisplay from './time-display';
import timeDiff from './time-diff';

function register() {
  timeDisplay();
  timeDiff();
}

if (window.WebComponents && window.WebComponents.ready) {
  register();
} else {
  window.addEventListener('WebComponentsReady', register);
}

