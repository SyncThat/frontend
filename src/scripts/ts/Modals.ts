export class Join {
    constructor(public room: number, public name?: string, public privateId?: string) {}
}

export interface PrivateUserData {
    privateId: string,
    publicId: string,
    name: string,
    admin: boolean
}

export interface User {
    id: string,
    name: string,
    connected: boolean
}

export interface Song {
    key: string;
    title: string;
    downloadProgress: number;
    ready: boolean;
    durationInSeconds: number;
    /** Public ID of the user who requested it */
    requestedBy?: string;
}
  
export interface CurrentSong {
    song: Song;
    playing: boolean;

    /** The last known 'current seconds' into the song at the moment of the event timestamp */
    lastCurrentSeconds: number;
    /** Epoch timestamp of the last song update */
    eventTimestamp: number;  
}

export interface Notice {
    message: string;
    type?: string;
}
