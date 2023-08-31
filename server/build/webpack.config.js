"use strict";
//import path from 'path';
const path = require('path');
//export default {
module.exports = {
    // Fichier d'entrée :
    entry: './client/src/main.ts',
    // Fichier de sortie :
    output: {
        path: path.resolve(process.cwd(), './client/public/build'),
        filename: 'main.bundle.js',
        publicPath: '/build/',
    },
    // compatibilité anciens navigateurs (si besoin du support de IE11 ou android 4.4)
    target: ['web', 'es5'],
    // connexion webpack <-> babel :
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                use: {
                    // ... seront compilés par tsc !
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.client.json',
                    },
                },
            },
        ],
    },
    devtool: 'source-map',
    devServer: {
        hot: false,
        static: {
            directory: './client/public',
            watch: {
                // optimisation live-reload
                ignored: 'node_modules',
            },
        },
        port: 8000,
        historyApiFallback: true, // gestion deeplinking
    },
    resolve: {
        // Ajoute le support de l'extension `.ts`
        extensions: ['.ts', '.js'],
        fallback: {
            fs: false,
        },
    },
};
//# sourceMappingURL=webpack.config.js.map