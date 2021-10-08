// Exported as a JS file instead of a JSON file so comments don't show up as format errors on GitHub.
module.exports = {
    extends: ['tslint:recommended', 'tslint-strict-error-throw'],
    rules: {
      /**
       * Custom disabled rules versus `tslint:recommended`.
       * Note that any formatting-related rules here might get overwritten by the Prettier config
       * in `tslint.json`.
       */
      /* Borrowed from `firebase/functions`. */
      'interface-name': false,
      'interface-over-type-literal': false,
      'max-classes-per-file': false,
      'member-access': false,
      'member-ordering': false,
      'no-console': false,
      'no-string-literal': false,
      'object-literal-shorthand': 'properties',
      'object-literal-sort-keys': false,
      'one-variable-per-declaration': false,
      radix: false,
  
      /* Custom for this project. */
  
      'array-type': false,
      // Do not allow the subtle/obscure comma operator.
      'ban-comma-operator': true,
  
      // Overridden by Prettier.
      'linebreak-style': [true, 'LF'],
  
      // Overridden by Prettier.
      semicolon: [true, 'never'],
  
      // Prefer === and !== over == and !=. The latter operators support overloads that are often
      // accidental.
      'triple-equals': true,
  
      'variable-name': {
        options: [
          // Variable names can't be keywords.
          'ban-keywords',
          // Variable names with leading underscores are encouraged when used situationally.
          'allow-leading-underscore',
        ],
      },
  
      // Enforce consistent whitespace conventions.
      whitespace: [true, 'check-rest-spread'],
    },
  }