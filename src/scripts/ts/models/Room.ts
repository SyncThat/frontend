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
    connected: boolean,
    admin: boolean,
    emoji?: string
}

export interface Song {
    key: string;
    title: string;
    downloadProgress: number;
    ready: boolean;
    durationInSeconds: number;
    waveformGenerated?: boolean;
    songInfo?: YoutubeDlJsonDump;
    likedDisliked: { [key: string]: boolean };

    /** Public ID of the user who requested it */
    requestedBy?: string;
    requestedAt?: number;
    playedAt?: number;
    stoppedAt?: number;
}

export interface YoutubeDlJsonDump {
    id: string,
    extractor: string,
    duration_string: string,
    title: string,
    description?: string,
    webpage_url?: string,
    uploader?: string,
    uploader_url?: string,
    thumbnail?: string,
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
    author: string;
    message: string;
    type?: string;
}
