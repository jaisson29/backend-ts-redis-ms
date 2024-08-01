module.exports = {
	apps: [
		{
			name: 'main-ms',
			script: './dist/api/index.js',
			watch: './dist/api',
		},
		{
			name: 'postgres-ms',
			script: './dist/postgres/index.js',
			watch: './postgres',
		},
		{
			name: 'post-ms',
			script: './dist/post/index.js',
			watch: './dist/post',
		},
	],
};
