$: << 'lib'

autoload :Bundler, 'bundler'
task :default => :test

desc 'Create bundled and minified source files.'
task :bundle do
  Bundler.bundle!
end

desc 'Boot test server - run tests at http://localhost:8003/'
task :test do
  exec 'node app.js'
  open 'localhost:8003'
end

desc 'Generate the documentation'
task :docs do
  exec "dox --title 'Davis' src/davis.*.js > docs/index.html"
end