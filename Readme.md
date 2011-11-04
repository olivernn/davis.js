# Davis.js

## Description

Davis.js is a small JavaScript library using HTML5 history.pushState that allows simple Sinatra style routing for your JavaScript apps.

## Why

Using the history pustState and popstate events allows the links and forms in your app to have hrefs and actions that point to real end points on your server.  This allows complex JavaScript apps to degrade gracefully when JavaScript is unavailable and combining this with a template system that can be used both client and server side allows for large amounts of code reuse.

Davis.js is heavily inspired by [Sammy.js](https://github.com/quirkey/sammy) (hence the name), it is however intentionally much lighter than Sammy.js because I never use any of the template rendering etc that it includes.  All Davis.js does is provide a simple routing layer, nothing more, nothing less.

## Requirements

Davis.js requires jQuery 1.4.2+ as well as a modern browser that supports HTML5 history.pushState and the onpopstate event.  At the moment that means FireFox 4+, Safari 5+, Chrome, iOS Safari 4+*, Android Browser 2.2+, Opera 11.50+.

In all other browsers Davis.js is currently unsupported, all links and forms will have their default behaviour.  You can bind to the 'unsupported' event on an app to handle this situation in your code.  Fallback to `location.hash` and `onhashchange` is a possibility in the future.

*Whilst pushState is supported in iOS it has several, fairly serious bugs.  Davis will not fire the unsupported event though as _technically_ iOS does support davis.

## Installation

Download davis.min.js and include it on your page after jquery.

## Example

A very simple example of a Davis.js app:

    var app = Davis(function () {
      this.get('/welcome/:name', function (req) {
        $('body').append('<h1>Hello there, ' + req.params['name'] + '!</h1>')
      })
    })
    
    $(document).ready(function () {
      // append a link to trigger the route
      $('body').append('<a href="/welcome/bob">Greet</a>');
      
      app.start();
    })

We create a new instance of a Davis.App using the Davis.js function, passing in a function that will draw the routes for the application.  Inside this function `this` is the instance of our application.

We define a simple get route with a 'name' parameter and a callback that will append a message to the html body.  Inside the route callback `this` is set to the request that matches the route, this request is also passed as a parameter to the callback.

Once the app is configure it needs to be started.  You start a Davis.js app by calling the `start` method, this must be done once the document is ready.  Now if you click on the link that we appended to the body our route should be called and a friendly greeting printed on the page.

To use Davis your html file must be loaded from a server rather than just opening the file in your browser.

## More

[API docs](http://olivernn.github.com/davis.js/docs)

[Example](http://davis-example.heroku.com/notes) using davis.js and a mustache templates shared between the client and the server, [code](http://github.com/olivernn/notepad)

## Contributing

Contributions are more than welcome, to make the process easier and quicker please follow these guidelines:

* Open an issue detailing the bug fix or feature in your patch.
* Add test cases for your code.
* Don't change the version or build new versions as part of you patch.

## Running examples

  First you'll need [node](http://nodejs.org) installed for the server. Then execute the following command and visit one of the examples: `http://localhost:3000/examples/todo.html`.
  
    $ make test

## Feedback

Any feedback or suggestions are welcome via [issues](https://github.com/olivernn/davis.js/issues).