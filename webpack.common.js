const {
  DefinePlugin
} = require('webpack')
const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const WebpackBar = require('webpackbar');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

const webpaclAlias = {
  '@': path.resolve(__dirname, 'src'),
}
const isSSR = process.env.SSR === 'true'
const isDEV = process.env.NODE_ENV === 'development'

const isCSRDEV = isDEV && !isSSR
const isSSRDEV = isDEV && isSSR

const isWebpackBuildServer = process.env.BUILD === 'server'

const babelPresets = (env) => {
  const common = [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      shippedProposals: true,
      modules: false,
      debug: false,
      bugfixes: true,
      corejs: {
        version: '3.21.1'
      },
    },
  ]
  if (env === 'node') {
    common[1].targets = {
      node: '14',
    }
  } else {
    common[1].targets = {
      esmodules: true,
    }
  }
  return common
}

const webpackPlugins = () => {
  const webpackCommonPlugins = isCSRDEV ? [
    new DefinePlugin({
      'process.env.SSR': JSON.stringify(process.env.SSR),
    }),
    new ReactRefreshWebpackPlugin(),
  ] : [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SSR': JSON.stringify(process.env.SSR),
    }),
  ]

  const webpackpPlugins = [
    ...webpackCommonPlugins,
    !isWebpackBuildServer ?
    new HtmlWebpackPlugin(
      isCSRDEV ? {
        title: 'ssr',
        template: path.resolve(__dirname, 'index.html'),
      } : {
        minify: {
          collapseWhitespace: true,
          removeComments: false,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        inject: true,
        template: path.resolve(__dirname, 'index.html'),
      }
    ) :
    null,
    !isWebpackBuildServer ? new ForkTsCheckerWebpackPlugin() : null,
    !isCSRDEV && new CleanWebpackPlugin(),
  ].filter((p) => !!p)

  if (!isCSRDEV) {
    const mincssOptions = {
      filename: isSSRDEV ? '[name].css' : '[name]-[contenthash].css',
      chunkFilename: isSSRDEV ?
        '[name].chunk.css' : '[name].[contenthash].chunk.css',
      ignoreOrder: true,
    }
    webpackpPlugins.push(
      new MiniCssExtractPlugin(
        !isWebpackBuildServer ? {
          linkType: 'text/css',
          ...mincssOptions,
        } : {
          linkType: false,
          runtime: false,
          ...mincssOptions
        }
      )
    )
  }

  if (!isWebpackBuildServer) {
    !isDEV &&
      webpackpPlugins.push(
        new CopyPlugin({
          patterns: [{
            from: './src/assets/favicon.ico',
            to: './favicon.ico',
          }, ],
        })
      )
  }
  webpackpPlugins.push(new WebpackBar({}))
  return webpackpPlugins
}

const cssProcessLoader = () => {
  const cssProcessLoaders = [{
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: !isDEV,
      },
    },
    'postcss-loader',
  ]
  if (isCSRDEV) {
    cssProcessLoaders.unshift('style-loader')
  } else {
    cssProcessLoaders.unshift(MiniCssExtractPlugin.loader)
  }
  return cssProcessLoaders
}

const babelPlugin = [
  isCSRDEV ? 'react-refresh/babel' : '',
  !isDEV ? ['transform-remove-console', {
    exclude: ['error', 'warn', 'info']
  }] :
  '',
].filter((p) => !!p)

const webpackpPlugins = webpackPlugins()

const cssProcessLoaders = cssProcessLoader()

module.exports = {
  cssProcessLoaders,
  webpackpPlugins,
  babelPlugin,
  babelPresets,
  webpaclAlias,
  isSSR,
  isDEV,
  isCSRDEV,
  isSSRDEV
}