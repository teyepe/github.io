# test.rb

require 'html-proofer'

raise IOError, 'Directory ./build does not exist. Run `middleman build` before running tests' unless Dir.exists?('./build')

HTMLProofer.check_directory('./build', {
  :check_img_http => true,
  :check_html => true, :validation => { :report_missing_names => true },
  :check_favicon => true,
  :check_opengraph => true,
  :http_status_ignore => [0,999,403,401]
}).run
# Check out the config docs for more: https://github.com/gjtorikian/html-proofer#configuration
