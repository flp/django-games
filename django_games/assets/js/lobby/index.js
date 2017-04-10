import React from 'react'
import ReactDOM from 'react-dom'

import MainLobby from './MainLobby.jsx'

var current_player = null;
var fetch_url = 'http://' + window.location.host + '/games/current_player/'
var ws_url = 'ws://' + window.location.host + '/games/'

function render_component() {
    ReactDOM.render(<MainLobby current_player={current_player} ws_url={ws_url} />, document.getElementById('container'));
}

var xhr = new XMLHttpRequest();
xhr.open('GET', fetch_url);
xhr.send(null);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        current_player = xhr.responseText;
        render_component();
    }
};
