export interface SonosDevice {
    device: DeviceDetails;
    householdId: string;
    locationId: string;
    playerId: string;
    groupId: string;
    websocketUrl: string;
    restUrl: string;
}

export interface DeviceDetails {
    id: string;
    primaryDeviceId: string;
    serialNumber: string;
    model: string;
    modelDisplayName: string;
    color: string;
    capabilities: string[];
    apiVersion: string;
    minApiVersion: string;
    websocketUrl: string;
    softwareVersion: string;
    hwVersion: string;
    swGen: number;
}
