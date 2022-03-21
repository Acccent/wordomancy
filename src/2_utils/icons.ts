import { icons as unicons } from '@iconify-json/uil';
import { icons as fluent } from '@iconify-json/fluent';
import { icons as twemojis } from '@iconify-json/twemoji';
import emojis from '@/../public/emojis.json';
import { addIcon } from '@iconify/vue/offline';

Object.entries({
  'u-upload': 'upload-alt',
  'f-move-left': 'arrow-export-rtl-24-regular',
  'f-move-right': 'arrow-export-ltr-24-regular',
  'f-backspace': 'backspace-24-regular',
  'f-hint': 'square-hint-sparkles-24-filled',
}).forEach(([name, icon]) => {
  addIcon(name, {
    body: (name[0] === 'u' ? unicons : fluent).icons[icon].body,
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
