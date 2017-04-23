module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: ['last 2 versions']
        }),
        require('postcss-discard-duplicates'),
        require('postcss-discard-empty'),
        require('postcss-merge-rules'),
        require('postcss-merge-longhand'),
        require('postcss-ordered-values'),
        require('postcss-unique-selectors'),
        require('css-declaration-sorter'),
        require('css-mqpacker')({
            sort: true
        })
    ]
}
