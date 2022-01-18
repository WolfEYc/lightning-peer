import SimplePeer from 'simple-peer';
import { Server } from 'socket.io'

class lightningSignalServer extends Server {

    init = () => {
        this.on('connection', (socket) => {

            socket.on('join-room', (room_id: string, user_name: string) => {

                const room = this.of("/").adapter.rooms.get(room_id);

                if(room) {
                    if(room.size > 1) {
                        socket.emit('failed-to-join-room', 'too-many-people');
                        return;
                    }
                }

                if(user_name.length < 3) {
                    socket.emit('failed-to-join-room', 'name-too-short');
                    return;
                }

                socket.on('existing-user', (remote_socket_id: string) => {
                    this.to(remote_socket_id).emit('load-existing-user', socket.id, user_name);
                })

                socket.on('disconnect', () => {
                    console.log(`${socket.id} using name ${user_name} has left room ${room_id}`)
                    socket.to(room_id).emit('user-disconnected', socket.id);
                })

                socket.on('signal-data', (remote_socket_id: string, data: SimplePeer.SignalData) => {
                    this.to(remote_socket_id).emit('signal-data', socket.id, data);
                })

                socket.on('associate', (remote_socket_id: string, stream_id: string, type: string) => {
                    console.log(remote_socket_id, stream_id, type)

                    this.to(remote_socket_id).emit('associate', socket.id, stream_id, type);
                })

                socket.on('associated', (remote_socket_id: string, stream_id: string) => {
                    this.to(remote_socket_id).emit('associated', socket.id, stream_id);
                })

                socket.on('stopShare', () => {
                    socket.to(room_id).emit('stopShare');
                })
                

                socket.emit('joined-room');

                socket.join(room_id);

                socket.to(room_id).emit('new-user', socket.id, user_name)
            })


        })


    }

}   

export default lightningSignalServer