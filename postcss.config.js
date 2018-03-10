module.exports = {
    plugins: [
        require('postcss-easy-import'),
        require('postcss-modular-scale'),
        require('postcss-color-function'),
        require('postcss-nested'),
        require('postcss-mixins'),
        require('postcss-cssnext'),
        require('postcss-media-variables'),
        require('postcss-custom-media'),
        require('css-declaration-sorter'),
        require('postcss-discard-duplicates'),
        require('postcss-discard-empty'),
        require('postcss-merge-rules'),
        require('postcss-merge-longhand'),
        require('postcss-ordered-values'),
        require('postcss-unique-selectors'),
        require('css-mqpacker')({
            sort: true
        })
    ]
}
