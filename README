# davis.js

A JavaScript library using html5 history.pushState that allows simple sinatra like routing for you JavaScript apps.

Allows heavy JavaScript apps to degrade more gracefully when accessed without JavaScript as all links and forms can still point to real server end points unlike location.hash based routing.

## Example

A simple example of a davis.js app:

    var app = Davis(function () {
      this.get('/posts', function (req) {
        var posts = Post.all();
      })

      this.get('/posts/:id', function (req) {
        var post = Post.find(req.params['id'])
      })

      this.post('/posts', function (req) {
        var post = new Post (req.params)
      })
    })
      
    app.start()

By default davis binds itself to all links and forms on the page now, and in the future.  To be more selective over which links or forms davis binds to use the apps configure method before starting the app.

    app.configure(function () {
      this.linkSelector = 'a.davis-links';
      this.formSelector = 'form.davis-forms'
    });
    
    app.start();

## Dependencies

davis.js currently requires jQuery as well as a modern browser that supports both the history.pushState method and history.onpopstate event, currently this means the latest versions of Safari, Chrome and Firefox.