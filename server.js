const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// set listen port by heroku OR 3000 if not present (for local deployment)
const port = process.env.PORT || 3000;

var app = express();


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


// middleware
app.use((request, response, next) => {
    var now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;
    
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    
    next();
});

//app.use((request, response, next) => {
//    response.render('maintenance.hbs');
//});

app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getYear', () => {
   return new Date().getFullYear(); 
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (request, response) => {
    response.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to this webpage',
    });
});

app.get('/about', (request, response) => {
    response.render('about.hbs', {
        pageTitle: 'About Page',
    });
})

app.get('/bad', (request, response) => {
    response.send({
        errorMessage: 'Error: Bad request'
    });
});

app.get('/projects', (request, response) => {
    response.render('projects.hbs', {
        pageTitle: 'Projects',
    })
});

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});