module.exports = {
    plugins: [
        require('postcss-discard-empty'),
        require('postcss-discard-duplicates'),
        require('postcss-merge-rules'),
        require('postcss-merge-longhand'),
        require('postcss-unique-selectors'),
        require('postcss-ordered-values'),
        require('autoprefixer')({
            grid: true,
            browsers: ['> 5%']
        }),
        require('css-declaration-sorter')({
            order: 'concentric-css'
        }),
        require('css-mqpacker')({
            sort: true
        })
    ]
}
