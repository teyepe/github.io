require 'kramdown'
require 'builder'
require 'breakpoint'
require 'breakpoint-slicer'

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end
#
# disable layout
page '.htaccess.apache', :layout => false

# rename file after build
after_build do
  File.rename 'build/.htaccess.apache', 'build/.htaccess'
end

# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (https://middlemanapp.com/advanced/dynamic_pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes


# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end
activate :i18n, :mount_at_root => :en
activate :directory_indexes
activate :search_engine_sitemap
activate :meta_tags
activate :external_pipeline,
    name: :webpack,
    command: build? ?
    'BUILD_PRODUCTION=1 ./node_modules/webpack/bin/webpack.js --bail -p' :
    'BUILD_DEVELOPMENT=1 ./node_modules/webpack/bin/webpack.js --watch -d --progress --color',
    source: '.tmp/dist',
    latency: 1

set :url_root, 'http://teyepe.com/'
set :css_dir, 'assets/css/'
set :js_dir, 'assets/js/'
set :images_dir, 'assets/img/'

set :relative_links, true
set :markdown_engine, :kramdown
set :markdown, 
    :parse_block_html => true,
    :fenced_code_blocks => true, 
    :smartypants => true,
    :tables => true, 
    :superscript => true, 
    :underline => true, 
    :highlight => true, 
    :quote => true

# Reload the browser automatically whenever files change
configure :development do
    activate :livereload

    set :protocol, 'http://'
    set :host, 'localhost'
    set :port, '4567'
end

# Build-specific configuration
configure :build do
    set :trailing_slash, false

    set :protocol, 'http://'
    set :host, 'teyepe.com'
    # For example, change the Compass output style for deployment
    # activate :minify_css

    # Minify Javascript on build
    # activate :minify_javascript

    # Enable cache buster
    # activate :asset_hash

    # Use relative URLs
    # activate :relative_assets

    # Or use a different image path
    # set :http_prefix, "/Content/images/"


    # Minify Javascript, HTML, etc on build
    activate :minify_javascript
    activate :minify_css
    activate :minify_html

    # Use relative URLs
    activate :relative_assets

    # Enable cache buster
    activate :asset_hash, :ignore => %w(.png .ttf .otf .woff .woff2 .eot)

    # Or use a different image path
    # set :http_prefix, "/heben"

    activate :gzip, exts: %w(.js .css .html .htm .svg .ttf .otf .woff .eot)
    # activate :gzip, exts: %w(.js .css .html .htm .svg), ignore: %w(.ttf .otf .woff .woff2 .eot)
end

helpers do

    def permalink_helper(article = nil)
        if article.nil?
            data.site.url + current_page.url.gsub("index.html", "")
        else
            "#{data.site.url}#{article.url}"
        end
    end

    def nav_active(path)
        current_page.path == path ? 'is-active' : ''
    end

    def link_to_page name, url, mmclass
        path = path
        current = path =~ Regexp.new('^' + url[(1..-1)])

        if path == 'index' and name == ''
            current = true
        end

        class_name = current ? 'is-active' : ''

        "<a class='#{ mmclass } #{ class_name }' href=\"#{url}\">#{name}</a>"
    end
end

