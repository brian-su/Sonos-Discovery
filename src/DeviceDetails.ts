import axios, { AxiosError } from 'axios';
import https from 'https';
import { SonosDevice } from './SonosResponseModel';
import fs from 'fs';

export class DeviceDetailsHelper {
    private url: string;
    private ip: string;

    constructor(ip: string) {
        this.url = `https://${ip}:1443/api/v1/players/local/info`;
        this.ip = ip;

        this.makeRequest();
    }

    private makeRequest() {
        this.makeFolder();
        axios
            .get<SonosDevice>(this.url, {
                headers: { 'X-Sonos-Api-Key': '00000000-0000-0000-0000-000000000000' },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            })
            .then((response) => {
                console.log(`Got ${response.data.device.modelDisplayName} (${this.ip})`);
                var filename = `JSONFiles/${response.data.device.modelDisplayName} (${this.ip}).json`;
                fs.writeFile(filename, JSON.stringify(response.data), (err) => {
                    if (err != null) {
                        console.log(`Error writing file ${filename}.`);
                        console.log(`${JSON.stringify(err)}`);
                    }
                });
            })
            .catch((error: AxiosError) => {
                console.error(error.message);
            });
    }

    private makeFolder() {
        var dir = 'JsonFiles';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}
