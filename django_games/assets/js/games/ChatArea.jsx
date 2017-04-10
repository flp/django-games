import React from 'react'

class ChatArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBottomOfMessages();
        document.getElementById('chat-input')
            .addEventListener('keyup', function(event) {
                event.preventDefault();
                if (event.keyCode == 13) {
                    document.getElementById('chat-send').click();
                }
            });
    }

    componentDidUpdate() {
        this.scrollToBottomOfMessages();
    }

    scrollToBottomOfMessages() {
        const chatElement = document.getElementById('chat-messages-area');
        chatElement.scrollTop = chatElement.scrollHeight - chatElement.clientHeight;
    }

    getTimestamp(date) {
        function pad(n) {
            return (n < 10) ? '0' + n : '' + n;
        }

        const hoursStr = pad(date.getHours());
        const minutesStr = pad(date.getMinutes());
        return hoursStr + ':' + minutesStr;
    }

    renderMessage(message) {
        // Each message contains a player, a timestamp, and the message text.
        const author = 'player-' + message.player;
        const className = (this.props.current_player == author) ? 'chat-msg-self' : 'chat-msg-other';
        return (
            <div key={message.id} className={className}>
                <div className='chat-msg-text'>
                    {message.text}
                </div>
                <div className='chat-msg-timestamp'>
                    <span>{this.getTimestamp(new Date(message.created))}</span>
                </div>
            </div>
        )
    }

    compareMessages(msg1, msg2) {
        const d1 = new Date(msg1.created);
        const d2 = new Date(msg2.created);
        return d1 - d2;
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({[name]: target.value});
    }

    handleNewMessage(event) {
        if (this.state.message.length > 0) {
            var data = {
                'message_type': 'chat',
                'player': this.props.current_player,
                'text': this.state.message
            };
            this.setState({message:''});
            this.props.ws.state.ws.send(JSON.stringify(data));
        }
    }

    render() {
        var messages = this.props.chat.slice();
        messages.sort(this.compareMessages);
        return (
            <div className='chat-area'>
                <h3>Chat</h3>
                <div className='chat-messages-area' id='chat-messages-area'>
                    {messages.map(message => (
                        this.renderMessage(message)
                    ))}
                </div>
                <div className='chat-input-area'>
                    <input 
                        type='text' 
                        id='chat-input'
                        name='message' 
                        value={this.state.message}
                        onChange={this.handleInputChange} />
                    <button 
                        type='button'
                        id='chat-send'
                        className='my-button'
                        onClick={this.handleNewMessage}>
                        Send
                    </button>
                </div>
            </div>
        );
    }

}

export default ChatArea;
