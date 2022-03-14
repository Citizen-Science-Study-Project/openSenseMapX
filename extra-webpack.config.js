const webpack = require('webpack');

module.exports = {
    plugins: [new webpack.DefinePlugin({
        'process.env': {
            MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN),
            API_URL: JSON.stringify(process.env.API_URL),
            LOCATIONIQ_TOKEN: JSON.stringify(process.env.LOCATIONIQ_TOKEN)
        }
    })]
}
