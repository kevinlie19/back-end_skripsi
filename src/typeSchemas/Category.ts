import { enumType } from 'nexus';

export let Category = enumType({
  name: 'Category',
  members: [
    'CPR',
    'Burns',
    'Bruised',
    'Impaled',
    'OpenWound',
    'NoseBleed',
    'Cramps',
  ],
});
