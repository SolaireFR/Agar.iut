"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.js';
*/
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.js');
function addWebpackMiddleware(app) {
    var _a;
    const webpackConfigForMiddleware = Object.assign(Object.assign({}, webpackConfig), { mode: 'development', plugins: [new webpack.HotModuleReplacementPlugin()] });
    if (typeof webpackConfigForMiddleware.entry === 'string') {
        webpackConfigForMiddleware.entry = [
            'webpack-hot-middleware/client?reload=true',
            webpackConfigForMiddleware.entry, // notre fichier client/src/main.js
        ];
    }
    const compiler = webpack(webpackConfigForMiddleware);
    // activation des 2 middlewares nécessaires au live-reload :
    app.use(webpackDevMiddleware(compiler, {
        publicPath: (_a = webpackConfig.output) === null || _a === void 0 ? void 0 : _a.publicPath,
    }));
    app.use(webpackHotMiddleware(compiler));
}
exports.default = addWebpackMiddleware;
//# sourceMappingURL=addWebpackMiddleware.js.map