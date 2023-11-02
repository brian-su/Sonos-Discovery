import dgram from 'node:dgram';
import { DeviceDetailsHelper } from './DeviceDetails';

export class DeviceDiscovery {
    multicastIpRange = ['239.255.255.250', '255.255.255.255'];
    PLAYER_SEARCH = Buffer.from(
        ['M-SEARCH * HTTP/1.1', 'HOST: 239.255.255.250:1900', 'MAN: ssdp:discover', 'MX: 1', 'ST: urn:schemas-upnp-org:device:ZonePlayer:1'].join(
            '\r\n'
        )
    );

    socket = dgram.createSocket('udp4', (buffer, rinfo) => {
        var stringBuff = buffer.toString();
        if (stringBuff.match(/.+Sonos.+/)) {
            var modelCheck = stringBuff.match(/SERVER.*\((.*)\)/);
            var model = this.getModel(modelCheck);
            var addr = rinfo.address;
            new DeviceDetailsHelper(addr);
        }
    });

    constructor() {}

    getModel(modelCheck: RegExpMatchArray | null): string | null {
        if (modelCheck == null) return null;
        return modelCheck.length > 1 ? modelCheck[1] : null;
    }

    sendDiscover() {
        for (let ip of this.multicastIpRange) {
            this.socket.send(this.PLAYER_SEARCH, 0, this.PLAYER_SEARCH.length, 1900, ip, (error) => {
                console.log(JSON.stringify(error));
            });
        }
    }
}
