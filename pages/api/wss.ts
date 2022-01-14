// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import lightningSignalServer from '../../server/lightning-signaller';


const iohandler = (
  req: any,
  res: any
) => {
    if(!res.socket.server.io) {

        console.log('*First use, starting socket.io')

        const io = new lightningSignalServer(res.socket.server);

        io.init();

        res.socket.server.io = io
    } else {
        console.log('socket.io already running')
    }

    res.end()

}

export const config = {
    api: {
        bodyParser: false
    }
}

export default iohandler
