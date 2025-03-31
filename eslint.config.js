module.exports = [
    {
        ignores: ["node_modules", "dist"], // Ігноруємо непотрібні папки
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest", // Використовуємо останню версію ECMAScript
            sourceType: "module",
        },
        rules: {
            "prettier/prettier": "error", // Перевіряємо код на відповідність Prettier
            "no-unused-vars": "warn", // Попередження про невикористані змінні
            "no-console": "off", // Дозволяємо console.log
        },
        plugins: {
            prettier: require("eslint-plugin-prettier"),
        },
    },
];
