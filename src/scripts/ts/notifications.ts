import { Ref, ref, UnwrapRef, watch } from "vue";
import { LogChatMessage, LogMessage, LogMessageType, LogNotification, NotificationType } from "./models/Chat";
import { getFromStorage, setInStorage } from "./helpers/storage";
import { PrivateUserData } from "./models/Room";

const STORAGE_NOTIFICATION_SETTINGS = 'notification_settings';
const STORAGE_NOTIFICATION_CHAT = 'chat_notification_setting';

class NotificationManager {
	
	private readonly access: Ref<boolean>;
	private settings: { [type in NotificationType]?: NotificationSetting };
	private chatBrowserNotification: boolean;


	constructor() {
		this.access = ref(Notification.permission === 'granted');

		// Configure default settings
		this.settings = {}
		const add = (type: NotificationType, big: boolean, browser: boolean) => this.settings[type] = { type, big, browser };

		add(NotificationType.PRIVATE_MESSAGE, true, true)
		add(NotificationType.USER_JOIN, false, false)
		add(NotificationType.USER_LEAVE, false, false)
		add(NotificationType.USER_CHANGED_NAME, true, false)
		add(NotificationType.SONG_ADDED_TO_QUEUE, false, false)
		add(NotificationType.SONG_REMOVED_FROM_QUEUE, true, false)
		add(NotificationType.SONG_QUEUE_MOVED, false, false)
		add(NotificationType.SONG_FORCE_PLAYED, true, false)
		add(NotificationType.SONG_VOTE_SKIPPED, false, false)
		
		this.chatBrowserNotification = true;

		// Load previous settings from storage
		this.restoreSettingsFromStorage();
	}
	
	private restoreSettingsFromStorage(): void {
		const chat = getFromStorage<boolean>(STORAGE_NOTIFICATION_CHAT);
		if (chat !== undefined) {
			this.chatBrowserNotification = chat;
		}
		
		const settings = getFromStorage<NotificationSetting[]>(STORAGE_NOTIFICATION_SETTINGS);
		if (settings && Array.isArray(settings)) {
			settings.forEach(setting => {
				// @ts-ignore
				if (this.settings.hasOwnProperty(setting.type)) {
					// @ts-ignore
					const currentSetting = this.settings[setting.type];
					if (setting.browser !== undefined) {
						currentSetting.browser = setting.browser;
					}
					if (setting.big !== undefined) {
						currentSetting.big = setting.big;
					}
				}
			})
		}
	}

	public watchMessageStreams(me: Ref<PrivateUserData | undefined>, ...messageStreams: Ref<LogMessage[] | undefined>[]): void {
		messageStreams.forEach(stream => {
			let lastId: string|undefined = undefined;

			watch(stream, messages => {
				if (messages === undefined) return;

				let notify = lastId === undefined;
				for (const message of messages) {
					// Find the last message that we notified on
					if (!notify) {
						if (message.id === lastId) {
							// Found it!
							notify = true;
						}
						continue;
					}

					// We've found it, notify about this message.
					this.notify(message, me.value?.publicId);
				}
			})
		})
	}

	public notify(message: LogMessage, currentUserId: string|undefined): void {
		if (!this.canNotify || document.hasFocus()) return;

		if (message.type === LogMessageType.ChatMessage) {
			this.notifyChat(message as LogChatMessage, currentUserId);
		} else if (message.type === LogMessageType.Notification) {
			this.notifyNotification(message as LogNotification);
		}
	}

	private notifyChat(message: LogChatMessage, currentUserId: string|undefined): void {
		if (!this.chatBrowserNotification || message.byId === currentUserId) return;

		new Notification(`${message.name}`, {
			body: message.message,
		});
	}


	private notifyNotification(notification: LogNotification): void {
		const setting = this.settings[notification.notificationType];
		if (!setting || !setting.browser) return;

		new Notification(notification.message);
	}



	
	public saveSettings(): void {
		setInStorage(STORAGE_NOTIFICATION_SETTINGS, Object.values(this.settings));
		setInStorage(STORAGE_NOTIFICATION_CHAT, this.chatBrowserNotification);
	}

	requestPermission(): void {
		Notification.requestPermission().then(permission => {
			this.access.value = permission === 'granted';
		});
	}

	public accessRef() {
		return this.access;
	}

	get canNotify(): boolean {
		return this.access.value;
	}
}

/**
 * Describes the setting for a single notification type.
 */
export interface NotificationSetting {
	type?: NotificationType;
	/** Whether the notification should be big in chat */
	big: boolean;
	/** Whether a native browser notification should be triggered */
	browser: boolean;
}

export const manager = new NotificationManager();

