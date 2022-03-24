import { icons as akar } from '@iconify-json/akar-icons';
import { icons as fluent } from '@iconify-json/fluent';
import { icons as unicons } from '@iconify-json/uil';
import { icons as twemojis } from '@iconify-json/twemoji';
import { addIcon } from '@iconify/vue/offline';
import emojis from '@/../public/emojis.json';

Object.entries({
  'a-twitter': 'twitter-fill',
  'a-google': 'google-fill',
  'a-discord': 'discord-fill',
  'f-move-left': 'arrow-export-rtl-24-regular',
  'f-move-right': 'arrow-export-ltr-24-regular',
  'f-backspace': 'backspace-24-regular',
  'f-hint': 'square-hint-sparkles-24-filled',
  'u-upload': 'upload-alt',
}).forEach(([name, icon]) => {
  const pre = name[0];
  const lib = pre === 'a' ? akar : pre === 'f' ? fluent : unicons;
  addIcon(name, {
    body: lib.icons[icon].body,
    width: 24,
    height: 24,
  });
});

emojis.forEach(name => {
  addIcon(name, {
    body: twemojis.icons[name].body,
    width: 36,
    height: 36,
  });
});
