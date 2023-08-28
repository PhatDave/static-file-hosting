import { writable } from 'svelte/store';
import type { Theme } from 'src/types';

export const createThemeStore = () => {
  const { subscribe, update, set } = writable<Theme | null>();

  return {
    subscribe,
    toggleTheme: () => {
      update(currentTheme => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', nextTheme);
        return nextTheme;
      });
    },
    init: () => {
      let theme = localStorage.getItem('theme');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        localStorage.setItem('theme', theme);
      }
      set(theme as Theme);
    }
  };
};

export const theme = createThemeStore();
