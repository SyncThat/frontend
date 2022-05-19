export enum LogMessageType {
    ChatMessage = 1,
    Notification = 2,
}

export interface LogMessage {
    id: string,
    type: LogMessageType;
    timestamp: number;
}

export interface LogChatMessage extends LogMessage {
    byId: string,
    name: string;
    message: string;
}

export interface LogNotification extends LogMessage {
    /** [highlighted] text */
    message: string;
    /** Type ID of the notification */
    notificationType: NotificationType;
    emoji?: string;
}

export enum NotificationType {
    PRIVATE_MESSAGE = -1,
    USER_JOIN = 1,
    USER_LEAVE = 2,
    USER_CHANGED_NAME = 3,
    SONG_ADDED_TO_QUEUE = 10,
    SONG_REMOVED_FROM_QUEUE = 11,
    SONG_QUEUE_MOVED = 12,
    SONG_FORCE_PLAYED = 15,
    SONG_VOTE_SKIPPED = 20,
}
