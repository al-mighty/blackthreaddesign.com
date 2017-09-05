source "https://rubygems.org"
ruby RUBY_VERSION

#run this before deployment if push fails
# can happen if gemfile.lock was deleted as
# platform ruby is required for interoperability with linux
#bundle lock --add-platform ruby

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
gem "jekyll", "3.5.2"

# web server
gem 'puma'
gem 'rack-jekyll'
gem 'rake'

# required by jekyll
# gem "font-awesome-sass"

# time zone data
gem "tzinfo-data"

# If you have any plugins, put them here!
group :jekyll_plugins do
	gem "jekyll-seo-tag"
	gem "jekyll-sitemap"
	gem "jekyll-livereload"
	gem "jekyll-gist"
  gem "jemoji"
end
