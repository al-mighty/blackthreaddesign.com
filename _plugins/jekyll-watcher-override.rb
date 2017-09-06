require 'jekyll-watch'
require 'listen'

module Jekyll
  module Watcher
    # replace old method by new method
    # new method is now :custom_excludes
    # overridden method is now :old_custom_excludes
    alias_method :old_custom_excludes, :custom_excludes
    def custom_excludes(options)
      # if we have an "exclude_from_watch" variable in configuration
      if options['exclude_from_watch'] then
        # merge exclude and exclude_from_watch
        (options['exclude'] << options['exclude_from_watch']).flatten!
      end
      # pass the new option array to overridden method
      old_custom_excludes(options)
    end

    # replace old method by new method
    # customized to make :force_polling => false,
    # preventing multiple calls to listener on each file change
    alias_method :old_build_listener, :build_listener
    def build_listener(site, options)
      Listen.to(
        options['source'],
        :ignore => listen_ignore_paths(options),
        :force_polling => false,
        :wait_for_delay => 2,
        :latency => 2,
        &(listen_handler(site))
      )
    end

  end
end