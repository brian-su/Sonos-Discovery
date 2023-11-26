import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import https from 'https';
import { SonosDevice } from './SonosResponseModel';
import fs from 'fs';

export class DeviceDetailsHelper {
    constructor() {
        this.makeFolder();
    }

    public async getDetailsForAllDevices(deviceIps: string[]) {
        for (let ip of deviceIps) {
            var url = `https://${ip}:1443/api/v1/players/local/info`;

            try {
                var response = await axios.get<SonosDevice>(url, {
                    headers: { 'X-Sonos-Api-Key': '00000000-0000-0000-0000-000000000000' },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                } as AxiosRequestConfig);
                this.writeData(response.data, ip);
            } catch (error: any) {
                console.error(error.message);
            }
        }
    }

    private writeData(data: SonosDevice, ip: string) {
        var filename = `${data.device.modelDisplayName} (${ip})`;
        console.log(`Writing ${filename} data`);

        try {
            fs.writeFileSync(`JSONFiles/${filename}.json`, JSON.stringify(data));
        } catch (error: any) {
            if (error != null) {
                console.error(`Error writing file ${filename}.`);
                console.error(`${JSON.stringify(error)}`);
            }
        }
    }

    private makeFolder() {
        var dir = 'JsonFiles';

        if (!fs.existsSync(dir)) {
            console.log('Creating JsonFile folder');
            fs.mkdirSync(dir);
            console.log('Folder created');
        } else {
            console.log('JsonFiles Folder already exists');
        }
    }
}
