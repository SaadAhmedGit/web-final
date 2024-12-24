module.exports = {
	// Shared configuration for the entire project
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
	  'eslint:recommended',
	  'plugin:@typescript-eslint/recommended'
	],
	rules: {
	  // Shared rules for the entire project
	},
	overrides: [
	  {
		// Configuration for client code
		files: ['client/**/*.js', 'client/**/*.ts'],
		rules: {
		  // Rules specific to client code
		}
	  },
	  {
		// Configuration for server code
		files: ['server/**/*.js', 'server/**/*.ts'],
		rules: {
		  // Rules specific to server code
		}
	  }
	]
  };
  