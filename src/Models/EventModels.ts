export interface SonosEvent {
    'e:propertyset': EPropertyset;
}

export interface EPropertyset {
    $: GeneratedType;
    'e:property': EProperty[];
}

export interface GeneratedType {
    'xmlns:e': string;
}

export interface EProperty {
    groupvolume?: string[];
    groupmute?: string[];
    groupvolumechangeable?: string[];
    lastchange: string[];
}
