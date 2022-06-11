import { io, Socket } from 'socket.io-client';
import { CurrentSong, Join, Notice, PrivateUserData, Song, User } from './models/Room';
import { LogMessage } from './models/Chat';
import { Ref, ref, UnwrapRef } from 'vue';
import { Config } from './Config';
import { getFromStorage, setInStorage } from "./helpers/storage";

export class RoomConnection {

	private conn: Socket;
	private queue: Ref<Song[]|undefined>;
	private playedSongs: Ref<Song[]|undefined>;
	private currentSong: Ref<CurrentSong|undefined>;
	private users: Ref<User[]|undefined>;
	private me: Ref<PrivateUserData|undefined>;
	private logMessages: Ref<LogMessage[]|undefined>;
	private privateMessages: Ref<LogMessage[]>;

	private lastSignOfLife: number;

	constructor(
		room: number, 
		queue: Ref<UnwrapRef<Song[]|undefined>>,
		playedSongs: Ref<UnwrapRef<Song[]|undefined>>,
		currentSong: Ref<UnwrapRef<CurrentSong | undefined>>, 
		users: Ref<User[]|undefined>, 
		me: Ref<PrivateUserData | undefined>, 
		logMessages: Ref<LogMessage[] | undefined>, 
		privateMessages: Ref<LogMessage[]> 
	) {
		this.queue = queue;
		this.playedSongs = playedSongs;
		this.currentSong = currentSong;
		this.users = users;
		this.me = me;
		this.logMessages = logMessages;
		this.privateMessages = privateMessages;
		this.lastSignOfLife = new Date().getTime();

		this.conn = io(Config.getBackendHost(),{
			path: '/rooms/ws',
			transports: [ "websocket" ],
			secure: Config.isBackendSecure(),
		})

		this.conn.on('connect', () => {
			console.log('Connected as', this.conn.id);

			const user = this.getUser();

			this.conn.emit('join-room', new Join(room, user?.name, user?.privateId));
		})

		this.conn.on('you', (user:PrivateUserData) => {
			console.log('You:', user);
			this.me.value = user;

			// Always save the user data (as the private ID might be refreshed)
			this.saveUser();
		})

		this.conn.on('disconnected', () => {
			console.log('Disconnected');
		})

		this.conn.on('users', (users:User[]) => {
			console.log('Users update:', users);
			this.users.value = users;
		});

		this.conn.on('current-song', (data:CurrentSong) => {
			console.log('Current song', data);
			this.currentSong.value = data;
		})

		this.conn.on('queue', (queue:Song[]) => {
			console.log('The queue:', queue);
			this.queue.value = queue;
		})

		this.conn.on('played-songs', (playedSongs:Song[]) => {
			console.log('The played songs:', queue);
			this.playedSongs.value = playedSongs;
		})

		this.conn.on('log', (messages:LogMessage[]) => {
			console.log(messages);
			this.logMessages.value = messages;
		})

		this.conn.on('private-message', (message:LogMessage) => {
			this.privateMessages.value = [
				...this.privateMessages.value,
				message
			];
		})

		this.conn.connect();
	}

	/**
	 * Download a song and add it to the queue
	 * @param song URL
	 */
	downloadSong(song: string) {
		this.conn.emit('queue-song', {
			url: song,
		});
	}

	/**
	 * Skip to the timestamp for the currently playing song
	 * @param toSeconds The number of seconds
	 * @param atTimestamp At which timestamp you were at that number of seconds
	 */
	skipToTimestamp(toSeconds: number, atTimestamp?: number): void {
		this.conn.emit('skip-to-timestamp', {
			toSeconds,
			atTimestamp,
		})
	}

	/**
	 * Vote a Yay/Nay/'No Vote' on the current song
	 * @param vote true = yay, false = nay, undefined = no vote
	 */
	voteOnCurrentSong(vote: boolean|undefined) {
		this.conn.emit('vote-on-current-song', {
			vote
		})
	}

	/**
	 * Vote for the current song to be skipped
	 */
	voteSkip() {
		this.conn.emit('vote-skip-current-song')
	}

	/**
	 * Force skip the current song (if possible)
	 */
	skipSong() {
		this.conn.emit('skip-song');
	}

	/**
	 * Remove a given song from the current queue.
	 * @param song
	 */
	removeFromQueue(song: Song) {
		this.conn.emit('remove-song-from-queue', {
			key: song.key,
		});
	}

	/**
	 * Force play a certain song from the queue.
	 * Note that this song has to have been fully downloaded
	 * @param song
	 */
	forcePlayFromQueue(song: Song) {
		this.conn.emit('force-play-from-queue', {
			key: song.key,
		})
	}

	/**
	 * Move the song to a different position in the queue
	 * @param song
	 * @param newPosition zero-based position
	 */
	moveSongInQueue(song: Song, newPosition: number) {
		console.log('Moving song to position', newPosition)
		this.conn.emit('move-song-in-queue', {
			key: song.key,
			position: newPosition,
		})
	}

	/**
	 * Attempt to become an admin
	 * @param password
	 */
	becomeAdmin(password: string): void {
		console.log('Become admin', password);
		this.conn.emit('become-admin', {
			password,
		});
	}

	/**
	 * Change the name of the current user
	 * @param change
	 */
	changeUser(change: ChangeUserMessage): void {
		this.conn.emit('change-user', change);
	}

	/**
	 * Notify the server about our current 'is playing' state
	 * @param isPlaying
	 */
	updatePlayState(isPlaying: boolean): void {
		this.conn.emit('change-user-is-playing', {
			isPlaying,
		});
	}

	/**
	 * Notify the server about our current 'is typing' state
	 * @param isTyping
	 */
	updateTypingState(isTyping: boolean): void {
		this.conn.emit('change-user-is-typing', {
			isTyping,
		});
	}

	/**
	 * Let the server know that the user is active (in some way)
	 */
	signOfLife(): void {
		const now = new Date().getTime();
		if (now - this.lastSignOfLife > 500) { // Only send a SOL (max) once per 0.5 sec
			this.lastSignOfLife = now;
			this.conn.emit('user-sign-of-life');
		}
	}
	
	saveUser() {		
		setInStorage('existingUser', {
			privateId: this.me.value?.privateId,
			publicId: this.me.value?.publicId,
			name: this.me.value?.name,
			admin: this.me.value?.admin,
		});
	}

	getUser(): StoredUser|undefined {
		return getFromStorage('existingUser');
	}

	sendChatMessage(message: string): void {
		this.conn.emit('send-chat-message', {
			message,
		});	
	}
}

interface StoredUser {
	privateId?: string,
	name?: string;
}

/**
 * Message to send to the server to change something about the current user
 */
export interface ChangeUserMessage {
	/** New name */
	name?: string,
	/** New emoji (either :name: or actual emoji) */
	emoji?: string,
	/** Request a new random emoji (takes priority over emoji field) */
	randomEmoji?: boolean,
}
