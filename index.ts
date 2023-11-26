import { env } from 'process';
import { DeviceDiscovery } from './src/DeviceDiscovery';
import { SonosEventListener } from './src/SonosEventListener';

console.log(env.mode);

switch (env.mode) {
    case 'DeviceDiscovery':
        new DeviceDiscovery().sendDiscover();
        break;
    case 'EventListener':
        new SonosEventListener();
        break;
    default:
        console.log('No mode found did nothing');
}
