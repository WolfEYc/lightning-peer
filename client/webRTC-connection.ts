import SimplePeer from 'simple-peer'
import io, { Socket } from 'socket.io-client'
import { EventEmitter } from 'events'


interface LocalUser {
    socket: Socket | null
    user_name: string,
    stream: MediaStream
}

interface RemotePeer {
    socket_id: string
    peer: SimplePeer.Instance,
    user_name: string,
    stream: MediaStream
}

class Lightning extends EventEmitter {

    localUser: LocalUser
    remotePeer: RemotePeer
    
    constructor() {
        super()

        const user_name = localStorage.getItem("user_name");

        fetch('/api/wss').finally(() => {

            const socket = io();

            socket.on('connect', () => {
                this.emit('connected');
            })

            socket.on('load-existing-user', (remote_socket_id: string, remote_user_name: string) => {
                console.log(`${remote_socket_id} found with name ${remote_user_name}`);

                this.remotePeer.user_name = remote_user_name

                this.peerConnect(remote_socket_id);
            })

            socket.on('new-user', (remote_socket_id: string, remote_user_name: string) => {
                console.log(`${remote_socket_id} joined with name ${remote_user_name}`);
                
                this.remotePeer.user_name = remote_user_name

                this.peerConnect(remote_socket_id, true);
            })

            this.localUser = { user_name: user_name ? user_name : "", stream: new MediaStream(), socket: socket }

        })

        
        this.localUser = { user_name: user_name ? user_name : "", stream: new MediaStream(), socket: null }
        this.remotePeer = { user_name: "", stream: new MediaStream(), peer: new SimplePeer(), socket_id: '0' }
    }

    getLocalMedia = async () => {

        if(this.remotePeer.peer.connected) {
            this.remotePeer.peer.removeStream(this.localUser.stream);
        }

        this.localUser.stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        if(this.remotePeer.peer.connected) {            
            this.remotePeer.peer.addStream(this.localUser.stream);
        }

        this.emit('local-stream-updated');
    }

    setName = (user_name: string) => {
        localStorage.setItem("user_name", user_name);
        this.localUser.user_name = user_name
    }

    joinRoom = (room_id: string) => {

        if(this.localUser.socket){

            this.localUser.socket.on('failed-to-join-room', (reason: string) => {

            })

            this.localUser.socket.on('joined-room', () => {
                this.emit('joined-room');
            })

            this.localUser.socket.emit('join-room', room_id, this.localUser.user_name);
        } else {
            this.on('connected', () => {
                this.joinRoom(room_id);
            })
        }
    }

    peerConnect = (remote_socket_id: string, initiator = false) => {

        
        const peer = new SimplePeer({ initiator: initiator });

        this.remotePeer.peer = peer;

        peer.on('signal', (data) => {
            if(this.localUser.socket){
                this.localUser.socket.emit('signal-data', remote_socket_id, data);
            }
        })

        peer.on('connect', () => {
            peer.addStream(this.localUser.stream);
        })

        peer.on('stream', (stream) => {
            this.remotePeer.stream = stream;
            this.emit('new-stream');
        })

        if(this.localUser.socket){
            this.localUser.socket.on('signal-data', (signal_socket_id: string, data: SimplePeer.SignalData) => {
                if(signal_socket_id == remote_socket_id) {
                    peer.signal(data);
                }
            })

            this.localUser.socket.on('user-disconnected', (socket_id: string) => {
                if(socket_id == remote_socket_id) {
                    peer.destroy();
                    console.log(`${socket_id} left`);
                    this.emit('user-disconnected', socket_id);
                }            
            })
        }

        if(initiator){
            if(this.localUser.socket){
                this.localUser.socket.emit('existing-user', remote_socket_id);
            }
        }
        

    }

}

const lightning = new Lightning()

export default lightning;