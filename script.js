/* Create an array of colors to use for background changing */
var arColors = ['1F618D',
    '424949',
    'DC7633',
    '73C6B6',
    '8E44AD',
    'E74C3C',
    '2C3E50',
    '27AE60'
];

/* This function is what is called when the "Get New Quote" button is clicked
/* It will call other smaller functions to do everything it needs to do. */
function changeQuote() {

    // First change the background color - animate style.
    changeColor();

    // Then load up a new quote
    getQuote();

} // end changeQuote

/* function changeColor */
/* this function will change the color of the body background using jQuery animation  */
/* to give a fade effect. */
function changeColor() {

    // this fades in a new background color for the body
    $('body').animate({
        'background-color': '#' + arColors[Number(window.name)]
    });

    // also change the text color so it looks like the text is transparent
    // document.getElementById("quote").text.css({ 'color': 'red' });
    //document.getElementById("author").css({ 'color': 'red', 'font-size': '150%' });
    $('p').animate({
        'color': '#' + arColors[Number(window.name)]
    });

    // because it won't work in codepen io.... this is the boring way to reset background
    //document.body.style.backgroundColor ='#' + arColors[Number(window.name)];

    // we are storing the current location in the array in the 
    // window.name variable so we need to increment it each time
    // we move change the color or set it back to zero if we've
    // gone through the array.
    if (Number(window.name) < (arColors.length - 1)) {
        window.name = Number(window.name) + 1;
    } else {
        window.name = 0;
    }

} // end function colorChange

/* function getQuote */
/* this function will retrieve a new quote in JSON format from https://api.forismatic.com */
function getQuote() {

    // use jQuery to get the JSON quote
    $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?")
        .done(parseQuote)
        .fail(handleErr);

} // end function getQuote

function parseQuote(response) {

    //set a variable to hold the author since we'll tweak it a bit
    var author = response.quoteAuthor;
    var quote = response.quoteText;

    // since we are also allowing these to go up on twitter
    // we need to limit to 140 characters - i'll allow just the quote
    // to go to twitter so it's not quite as limiting
    if (quote.length > 140) {
        // console.log('getting new quote');
        getQuote();
        return;
    } else {
        // check if author is blank and if so put "unknown"
        if (author.length < 1) {
            author = '- unknown';
        } else {
            author = '- ' + author;
        }
    }

    // to make sure both author and quote can go to twitter,
    // otherwise just quote should go
    if (quote.length + author.length > 139) {
        //prep twitter link with quote only
        setTwitterLink(quote);
    } else {
        setTwitterLink(quote + ' ' + author);
    }

    // do the rest of the code if those conditions are met

    // set the html to the new quote
    document.getElementById("quote").innerHTML = response.quoteText;

    // set the html to the new author
    document.getElementById("author").innerHTML = author;

} // end parseQuote

function handleErr(response) {
    alert('There was an unforseen issue. Please try again later. Error: ' + response);
} // end handleErr

function setTwitterLink(content) {

    // set the value of the url based on how long the tweet was
    var tweetUrl = 'https://twitter.com/intent/tweet?text=' + content;

    //set the href value back in the html
    $("#twitterLink").attr("href", tweetUrl);

} // end setTwitterLink

$(document).ready(function() {

    // default the value window.name to 0 - the first element in our array
    window.name = 0;

    // set the background color
    changeColor();

    // Get our first quote
    getQuote();

}); // end $(document).ready