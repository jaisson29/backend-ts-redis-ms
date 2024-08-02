/* eslint-disable no-undef */
module.exports = [
  {
    name: 'main-ms',
    script: './dist/main/index.js',
    watch: './dist/main',
  },
  {
    name: 'postgres-ms',
    script: './dist/postgres/index.js',
    watch: './dist/postgres',
  },
  {
    name: 'post-ms',
    script: './dist/post/index.js',
    watch: './dist/post',
  },
  {
    name: 'cache-ms',
    script: './dist/cache/index.js',
    watch: './dist/cache',
  },
];
