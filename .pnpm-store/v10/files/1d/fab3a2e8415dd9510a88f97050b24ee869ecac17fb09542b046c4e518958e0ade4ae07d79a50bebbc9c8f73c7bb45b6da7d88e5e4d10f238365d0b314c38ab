import { Rule, Linter } from 'eslint';

interface RuleModule<T extends readonly unknown[]> extends Rule.RuleModule {
    defaultOptions: T;
}

type Options$1 = [
    {
        indent?: number | 'tab';
    }
];

type Options = [
    {
        ArrayExpression?: boolean;
        ArrowFunctionExpression?: boolean;
        CallExpression?: boolean;
        ExportNamedDeclaration?: boolean;
        FunctionDeclaration?: boolean;
        FunctionExpression?: boolean;
        ImportDeclaration?: boolean;
        NewExpression?: boolean;
        ObjectExpression?: boolean;
        TSInterfaceDeclaration?: boolean;
        TSTupleType?: boolean;
        TSTypeLiteral?: boolean;
        TSTypeParameterDeclaration?: boolean;
        TSTypeParameterInstantiation?: boolean;
        ObjectPattern?: boolean;
        ArrayPattern?: boolean;
    }
];

declare const plugin: {
    meta: {
        name: string;
        version: string;
    };
    rules: {
        'consistent-list-newline': RuleModule<Options>;
        'generic-spacing': RuleModule<[]>;
        'if-newline': RuleModule<[]>;
        'import-dedupe': RuleModule<[]>;
        'named-tuple-spacing': RuleModule<[]>;
        'no-cjs-exports': RuleModule<[]>;
        'no-import-node-modules-by-path': RuleModule<[]>;
        'no-ts-export-equal': RuleModule<[]>;
        'prefer-inline-type-import': RuleModule<[]>;
        'top-level-function': RuleModule<[]>;
        'indent-binary-ops': RuleModule<Options$1>;
        /**
         * @deprecated Use `'no-restricted-syntax': ['error', 'TSEnumDeclaration[const=true]']` instead.
         */
        'no-const-enum': RuleModule<[]>;
    };
};

type RuleDefinitions = typeof plugin['rules'];
type RuleOptions = {
    [K in keyof RuleDefinitions]: RuleDefinitions[K]['defaultOptions'];
};
type Rules = {
    [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>;
};

export { type RuleOptions, type Rules, plugin as default };
