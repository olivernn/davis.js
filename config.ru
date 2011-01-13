map "/" do
  run Rack::File.new("/Users/olivernightingale/code/davies/index.html")
end

map "/javascripts/davies.js" do
  run Rack::File.new("/Users/olivernightingale/code/davies/javascripts/davies.js")
end