import { io, Socket } from 'socket.io-client';
import { CurrentSong, Join, Notice, PrivateUserData, Song, User } from './Modals';
import { Ref, ref, UnwrapRef } from 'vue';

export class RoomConnection {

	private conn: Socket;
	private queue: Ref<Song[]|undefined>;
	private currentSong: Ref<CurrentSong|undefined>;
	private users: Ref<User[]|undefined>;
	private me: Ref<PrivateUserData|undefined>;

	constructor(room: number, queue: Ref<UnwrapRef<Song[]|undefined>>, currentSong: Ref<UnwrapRef<CurrentSong | undefined>>, users: Ref<User[]|undefined>, me: Ref<PrivateUserData | undefined>) {
		this.queue = queue;
		this.currentSong = currentSong;
		this.users = users;
		this.me = me;

		this.conn = io('localhost:3555',{
			path: '/rooms/ws',
			transports: [ "websocket" ],
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

		this.conn.on('notice', (notice:Notice) => {
			console.log(notice);
		})

		console.log(this.conn);

		this.conn.connect();
	}

	addNoticeCallback(callback: (notice: Notice) => void): void {
		this.conn.on('notice', callback);
	}

	downloadSong(song: string) {
		this.conn.emit('queue-song', {
			url: song,
		});
	}

	skipToTimestamp(toSeconds: number, atTimestamp?: number): void {
		this.conn.emit('skip-to-timestamp', {
			toSeconds,
			atTimestamp,
		})
	}

	becomeAdmin(password: string): void {
		console.log('Become admin', password);
		this.conn.emit('become-admin', {
			password,
		});
	}
	
	saveUser() {		
		window.localStorage.setItem('existingUser', JSON.stringify({
			privateId: this.me.value?.privateId,
			publicId: this.me.value?.publicId,
			name: this.me.value?.name,
			admin: this.me.value?.admin,
		}));
	}

	getUser(): StoredUser|undefined {
		let item = window.localStorage.getItem('existingUser');
		return item ? JSON.parse(item) : undefined;
	}
}

interface StoredUser {
	privateId?: string,
	name?: string;
}

