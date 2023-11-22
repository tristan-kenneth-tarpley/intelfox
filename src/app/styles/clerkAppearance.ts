import classNames from 'classnames';
import { orange, red, zinc } from '../../../palette';
import { inter } from './fonts';

const clerkAppearance = {
  variables: {
    colorPrimary: orange[600],
    colorSecondary: orange[600],
    colorText: zinc[200],
    colorDanger: red[600],
    colorInputText: zinc[700],
    colorInputBackground: zinc[900],
    colorBackground: zinc[950],
    fontFamily: inter.style.fontFamily,
  },
  elements: {
    formFieldInput: classNames(
      'bg-zinc-950 px-2 py-2 rounded-md',
      'border-zinc-800 border focus:border-zinc-600',
      'placeholder:text-zinc-400 text-zinc-200 text-sm',
      'hover:bg-zinc-900 duration-100',
    ),
    card: 'border-zinc-700 border',
  },
} as const;

export default clerkAppearance;
