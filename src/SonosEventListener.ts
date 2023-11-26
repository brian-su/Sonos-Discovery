import helmet from 'helmet';
import express, { Express } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import xmlparser from 'express-xml-bodyparser';
import { SonosEvent } from './Models/EventModels';
import { XMLParser } from 'fast-xml-parser';
import { VolumeEventModel } from './Models/VolumeEventModel';

export class SonosEventListener {
    ip: string = '192.168.50.105';
    port: string = '1400';
    notifyEndpoint: string = '/notify';
    deviceEventEndpoints = [
        '/MediaRenderer/AVTransport/Event',
        '/MediaRenderer/RenderingControl/Event',
        '/MediaRenderer/GroupRenderingControl/Event',
        '/MediaRenderer/Queue/Event'
    ];
    app: Express;

    constructor() {
        this.app = express();
        this.app.listen(3000, () => {
            console.log(`Event listener now open on port 3000`);
        });
        this.app.use(helmet());
        this.app.use(xmlparser());
        this.setupEndpoints();
        this.subscribeToSonos();
    }

    setupEndpoints() {
        this.app.all(this.notifyEndpoint, (request, response) => {
            var body = request.body as SonosEvent;
            console.log(`BODY: ${body}`);
            var serviceType = request.get('x-sonos-servicetype');
            console.log(`HEADERS: ${serviceType}`);

            if (body['e:propertyset']['e:property'][0].lastchange) {
                const parser = new XMLParser({ ignoreAttributes: false });
                var jObj = parser.parse(body['e:propertyset']['e:property'][0].lastchange[0]);
                this.parseXml(jObj, serviceType!);
            }

            response.sendStatus(200);
        });
    }

    parseXml(jObj: any, serviceType: string) {
        if (serviceType === 'RenderingControl') {
            var volumeList = jObj['Event']['InstanceID']['Volume'] as VolumeEventModel[];
            var value = volumeList.filter((x) => x['@_channel'] === 'master')[0]['@_val'];
        }
    }

    subscribeToSonos() {
        for (let endpoint of this.deviceEventEndpoints) {
            var config: AxiosRequestConfig = {
                method: 'SUBSCRIBE',
                url: `http://${this.ip}:${this.port}${endpoint}`,
                headers: { NT: 'upnp:event', Timeout: ' Second-1800', callback: '<http://192.168.50.232:3000/notify>' }
            };
            axios.request(config);
        }
    }
}
