import { icons as akar } from '@iconify-json/akar-icons';
import { icons as fluent } from '@iconify-json/fluent';
import { icons as twemojis } from '@iconify-json/twemoji';
import { addIcon } from '@iconify/vue/offline';
import emojis from '@/../public/emojis.json';

const iconList = {
  'a-twitter': 'twitter-fill',
  'a-google': 'google-fill',
  'a-discord': 'discord-fill',
  'f-submit': 'dock-24-regular',
  'f-move-left': 'arrow-export-rtl-24-regular',
  'f-move-right': 'arrow-export-ltr-24-regular',
  'f-backspace': 'backspace-24-regular',
  'f-delete': 'delete-24-regular',
  'f-hint': 'square-hint-sparkles-24-filled',
  'f-info': 'info-24-regular',
  'f-question': 'question-circle-24-regular',
  'f-settings': 'settings-24-regular',
  'f-signin': 'person-arrow-left-24-regular',
  'f-signout': 'person-arrow-right-24-regular',
  'f-square': 'square-24-regular',
  'f-played': 'play-circle-24-regular',
  'f-average': 'number-symbol-square-24-regular',
  'f-solved': 'checkmark-square-24-regular',
  'f-failed': 'dismiss-square-24-regular',
  'f-friend': 'emoji-24-regular',
  'f-not-friend': 'emoji-smile-slight-24-regular',
  'f-remove-friend': 'person-delete-24-regular',
  'f-stats': 'data-histogram-24-regular',
  'f-clock': 'clock-24-regular',
};

for (const [name, icon] of Object.entries(iconList)) {
  const lib = name[0] === 'a' ? akar : fluent;
  addIcon(name, {
    body: lib.icons[icon].body,
    width: 24,
    height: 24,
  });
}

for (const name of emojis) {
  addIcon(name, {
    body: twemojis.icons[name].body,
    width: 36,
    height: 36,
  });
}
