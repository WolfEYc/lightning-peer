import SimplePeer, { SimplePeerData } from 'simple-peer'
import io, { Socket } from 'socket.io-client'
import { EventEmitter } from 'events'

interface LocalUser {
    socket?: Socket,
    user_name?: string,
    stream?: MediaStream,
    streamAdded: boolean,
    shareStream?: MediaStream,
    shareAdded: boolean,
}

interface RemotePeer {
    socket_id?: string
    peer?: SimplePeer.Instance,
    user_name?: string,
    stream?: MediaStream,
    stream_id?: string,
    shareStream?: MediaStream,
    shareStream_id?: string
}

interface LightningFile {
    file?: File
    rawtext?: string
    size?: number
    type?: string
}

class Lightning extends EventEmitter {

    localUser: LocalUser
    remotePeer: RemotePeer
    Files: Map<string, LightningFile>
    chunkSize: number

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

            socket.on('associate', (remote_socket_id: string, stream_id: string, type: string) => {
                if(type == 'normal') {
                    this.remotePeer.stream_id = stream_id;
                } else {
                    this.remotePeer.shareStream_id = stream_id;
                }

                socket.emit('associated', remote_socket_id, stream_id);
            })
            this.localUser.socket = socket
        })

        this.localUser = { user_name: user_name ? user_name : undefined, streamAdded: false, shareAdded: false }
        this.remotePeer = { }
        this.Files = new Map<string, LightningFile>();
        this.chunkSize = 16 * 1024;
    }

    getState = () => {
        return (+(this.localUser.stream != undefined)) + (+(this.remotePeer.stream != undefined) * 2) * (+(this.remotePeer.stream != undefined) * 4)
    }

    getLocalMedia = async () => {


        if(this.remotePeer.peer?.connected && this.localUser.stream && this.localUser.streamAdded) {
            //beanos
            this.remotePeer.peer.removeStream(this.localUser.stream);
            this.localUser.streamAdded = false;
        }

        this.localUser.stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        if(this.remotePeer.peer?.connected && this.localUser.socket && this.localUser.stream) {
            
            this.localUser.socket.on('associated', (remote_socket_id: string, stream_id: string) => {
                if(remote_socket_id == this.remotePeer.socket_id && this.localUser.stream && stream_id == this.localUser.stream.id && !this.localUser.streamAdded) {
                    //this.remotePeer.peer?.removeStream(this.localUser.stream);
                    this.localUser.streamAdded = true;
                    this.remotePeer.peer?.addStream(this.localUser.stream);
                }
            })
            this.localUser.socket.emit('associate', this.remotePeer.socket_id, this.localUser.stream.id, 'normal');   
        }
        this.emit('state-change');
    }

    getShareScreen = async () => {

        if(this.remotePeer.peer?.connected && this.localUser.shareStream && this.localUser.shareAdded) {
            this.remotePeer.peer.removeStream(this.localUser.shareStream);
            this.localUser.shareAdded = false;
        }
        try{
            this.localUser.shareStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            })
        } catch (err) {
            return false;
        }

        if(this.localUser.shareStream?.active){

            if(this.remotePeer.peer?.connected) {
                if(this.localUser.socket){
                    this.localUser.socket.on('associated', (remote_socket_id: string, stream_id: string) => {
                        if(remote_socket_id == this.remotePeer.socket_id && this.localUser.shareStream && stream_id == this.localUser.shareStream.id && !this.localUser.shareAdded) {
                            //this.remotePeer.peer?.removeStream(this.localUser.shareStream);
                            this.localUser.shareAdded = true;
                            this.remotePeer.peer?.addStream(this.localUser.shareStream);
                        }
                    })
                    this.localUser.socket.emit('associate', this.remotePeer.socket_id, this.localUser.shareStream.id, 'share');
                }
            }

            this.emit('local-shareStream-updated')

            return true;
        }

        return false;
    }

    stopShareScreen = () => {
        
        if(this.localUser.shareStream){

            const tracks = this.localUser.shareStream.getTracks();

            this.remotePeer.peer?.removeStream(this.localUser.shareStream)

            this.localUser.shareAdded = false;

            this.localUser.socket?.emit('stopShare');

            for(const track of tracks) {
                track.stop();
            }
        }

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

    finalizeFile = (filename: string, lFile: LightningFile) => {
        if(!lFile.rawtext) return;
        lFile.file = new File([lFile.rawtext], filename, { type: lFile.type });
        this.emit('fileReceived', false, lFile.file);
    }

    peerConnect = (remote_socket_id: string, initiator = false) => {
        const peer = new SimplePeer({ initiator: initiator });

        this.remotePeer.peer = peer;

        this.remotePeer.socket_id = remote_socket_id;

        peer.on('signal', (data) => {
            if(this.localUser.socket){
                this.localUser.socket.emit('signal-data', remote_socket_id, data);
            }
        })

        peer.on('connect', () => {
            if(this.localUser.stream?.active){
                
                if(this.localUser.socket){
                    this.localUser.socket.on('associated', (associate_socket_id: string, stream_id: string) => {
                        if(remote_socket_id == associate_socket_id && this.localUser.stream && stream_id == this.localUser.stream.id && !this.localUser.streamAdded) {
                            //peer.removeStream(this.localUser.stream)
                            this.localUser.streamAdded = true;
                            peer.addStream(this.localUser.stream);
                        }
                    })
                    
                    this.localUser.socket.emit('associate', this.remotePeer.socket_id, this.localUser.stream?.id, 'normal');
                }
            }

            if(this.localUser.shareStream?.active) {
                if(this.localUser.socket){
                    this.localUser.socket.on('associated', (associate_socket_id: string, stream_id: string) => {
                        if(remote_socket_id == associate_socket_id && stream_id == this.localUser.shareStream?.id && !this.localUser.shareAdded) {
                            //peer.removeStream(this.localUser.shareStream)
                            this.localUser.shareAdded = true;
                            peer.addStream(this.localUser.shareStream);
                        }
                    })
                    
                    this.localUser.socket.emit('associate', this.remotePeer.socket_id, this.localUser.shareStream?.id, 'share');
                }
            }
        })

        this.on('file', (fileName: string, fileSize: number, fileType: string) => {
            this.Files.set(fileName, { size: fileSize, type: fileType })
            this.peerEmit('file-accepted', fileName);
        })

        this.on('chunk', (fileName: string, chunk: string) => {
            const lFile = this.Files.get(fileName);
            if(!lFile) return;
            lFile.rawtext = lFile.rawtext ? lFile.rawtext + chunk : chunk;
            if(lFile.rawtext.length === lFile.size) {
                this.finalizeFile(fileName, lFile);
            }
        })

        //yippie! this is just an example use case!
        this.on('text', (local: boolean, text: string) => {
            
        })

        //example as well
        this.on('fileReceived', (local: boolean, file: File) => {
            
        })

        peer.on('data', (data: SimplePeerData) => {
            if(typeof data === 'string'){
                const msg = JSON.parse(data);
                this.emit(msg.type, ...msg.payload);
            }
        })

        peer.on('stream', (stream) => {

            if(stream.id == this.remotePeer.shareStream_id) {
                this.remotePeer.shareStream = stream;
                console.log('new share', stream)
                this.localUser.socket?.on('stopShare', () => {
                    this.remotePeer.shareStream = undefined;
                    this.emit('state-change');
                })
                this.emit('state-change');
            } else {
                this.remotePeer.stream = stream;
                //console.log('new stream', stream)
                this.emit('state-change');
            }
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
                    this.emit('state-change');
                }            
            })
        }

        if(initiator){
            if(this.localUser.socket){
                this.localUser.socket.emit('existing-user', remote_socket_id);
            }
        }
    }

    peerEmit = (type: string, ...payload: any[]) => {
        const { peer } = this.remotePeer;
        if(peer?.connected){
            peer.send(JSON.stringify({
                type: type,
                payload: payload
            }));
            return true;
        }
        return false;
    }

    setVideo = (enabled: boolean) => {
        if(this.localUser.stream){
            this.localUser.stream.getVideoTracks()[0].enabled = enabled
            return this.peerEmit('remote-video-enabled', enabled);
        }
        return false;
    }

    setAudio = (enabled: boolean) => {
        if(this.localUser.stream){
            this.localUser.stream.getAudioTracks()[0].enabled = enabled
            return this.peerEmit('remote-audio-enabled', enabled);
        }
        return false;
    }

    localStreamActive = () => {
        return this.localUser.stream?.getAudioTracks()[0] != undefined
    }

    localShareActive = () => {
        return this.localUser.shareStream?.getVideoTracks()[0]?.enabled
    }

    sendText = (text: string) => {
        return this.peerEmit('text', text);  
    }

    sendFile = async (file: File) => {
        const filetext = await file.text();

        const acceptedHandler = (fileName: string) => {
            if(fileName != file.name) return;
            for(let i = 0; i < filetext.length; i += this.chunkSize)
            {
                const chunk = filetext.slice(i, i + this.chunkSize);
                this.peerEmit('chunk', file.name, chunk);
            }
            this.Files.set(file.name, { file: file });
            this.emit('fileReceived', true, file);
        }

        const declinedHandler = (fileName: string) => {
            if(fileName != file.name) return;
            this.removeListener('file-accepted', acceptedHandler);
            this.removeListener('file-declined', declinedHandler);
        }

        this.on('file-accepted', acceptedHandler);
        this.on('file-declined', declinedHandler);

        this.peerEmit('file', file.name, filetext.length, file.type);
    }

}

const lightning = new Lightning()

export default lightning;