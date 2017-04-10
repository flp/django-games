import React from 'react'

class GameLogArea extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.scrollToBottomOfMessages();
    }

    componentDidUpdate() {
        this.scrollToBottomOfMessages();
    }

    getTimestamp(date) {
        function pad(n) {
            return (n < 10) ? '0' + n : '' + n;
        }

        const hoursStr = pad(date.getHours());
        const minutesStr = pad(date.getMinutes());
        const yearStr = date.getFullYear();
        const monthStr = pad(date.getMonth() + 1);
        const dayStr = pad(date.getDate());
        return hoursStr + ':' + minutesStr + ' ' + yearStr + '-' + monthStr + '-' + dayStr;
    }

    scrollToBottomOfMessages() {
        const element = document.getElementById('game-log-entries-area');
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }

    renderLogEntry(entry) {
        // Each entry contains a timestamp and the entry text
        return (
            <div key={entry.id} className='log-entry'>
                <div className='log-entry-text'>
                    {entry.text}
                </div>
                <div className='log-entry-timestamp'>
                    <span>{this.getTimestamp(new Date(entry.created))}</span>
                </div>
            </div>
        );
    }

    compareMessages(entry1, entry2) {
        const d1 = new Date(entry1.created);
        const d2 = new Date(entry2.created);
        return d1 - d2;
    }

    render() {
        var entries = this.props.log.slice();
        entries.sort(this.compareEntries);
        return (
            <div className='game-log-area'>
                <h3>Game Log</h3>
                <div className='game-log-entries-area' id='game-log-entries-area'>
                    {entries.map(entry => (
                        this.renderLogEntry(entry)
                    ))}
                </div>
            </div>
        );
    }

}

export default GameLogArea;
