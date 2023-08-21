module.exports = {
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 160,
    svelteStrictMode: false,
    svelteAllowShorthand: true,
    bracketSameLine: true,
    arrowParens: 'avoid',
    tabWidth: 4,
    useTabs: true,
    semi: true,
    plugins: ['prettier-plugin-svelte'],
    overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
    pluginSearchDirs: ['./'],
    endOfLine: 'lf',
    svelteBracketNewLine: false
};