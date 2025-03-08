module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.ios.jsx', '.android.jsx', '.js', '.jsx', '.json', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@store': './src/store',
          '@tools': './src/tools',
          '@views': './src/views',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
