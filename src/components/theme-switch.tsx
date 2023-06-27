import {useTheme} from 'next-themes';
import {Fragment, useEffect, useState} from 'react';

const themes = [
  {name: 'System', value: 'system'},
  {name: 'Dark', value: 'dark'},
  {name: 'Light', value: 'light'},
];

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <p className="text-md font-display font-light text-gray-700 dark:text-gray-400">
      Theme:{' '}
      {themes.map((item, index) => (
        <Fragment key={item.value}>
          <span
            className={`cursor-pointer font-semibold hover:underline ${theme === item.value ? 'text-blue-500' : ''}`}
            role="button"
            onClick={() => setTheme(item.value)}
          >
            {item.name}
          </span>
          {index < themes.length - 1 && ' | '}
        </Fragment>
      ))}
    </p>
  );
}
