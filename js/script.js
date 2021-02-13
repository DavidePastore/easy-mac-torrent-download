const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';
const ENDPOINT = 'https://mac-torrent-download.net/';

function showLoaderForSearchButton() {
    $("#searchButton")
        .attr('disabled', true)
        .html(LOADING_SPINNER);
}

function hideLoaderForSearchButton() {
    $("#searchButton")
        .attr('disabled', false)
        .html('Search');
}