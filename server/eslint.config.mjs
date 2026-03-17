import globals from "globals";

export default [
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            ecmaVersion: 2022,
            sourceType: "module",
        },
        rules: {
            "no-unused-vars": "warn",
        },
    },
];
