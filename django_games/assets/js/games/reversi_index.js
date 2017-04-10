import React from 'react'
import ReactDOM from 'react-dom'

import GameBox from './GameBox.jsx'

var current_player = null;
var game_creator = null;
var player_fetch_url = 'http://' + window.location.host + '/games/current_player/';
var creator_fetch_url = 'http://' + window.location.host + window.location.pathname + 'game_creator/';
var ws_url = 'ws://' + window.location.host + window.location.pathname;

function render_component() {
    ReactDOM.render(<GameBox gameType={'reversi'} current_player={current_player} game_creator={game_creator} ws_url={ws_url} />, document.getElementById('container'));
}

var xhr = new XMLHttpRequest();
xhr.open('GET', player_fetch_url);
xhr.send(null);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        current_player = xhr.responseText;
        var creatorXhr = new XMLHttpRequest();
        creatorXhr.open('GET', creator_fetch_url);
        creatorXhr.send(null);
        creatorXhr.onreadystatechange = function() {
            if (creatorXhr.readyState == 4 && creatorXhr.status == 200) {
                game_creator = creatorXhr.responseText;
                render_component();
            }
        };
    }
};
