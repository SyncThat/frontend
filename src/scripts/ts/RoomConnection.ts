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

			const existingUserId = this.getUser() ? this.getUser().privateId : undefined;
					
			this.conn.emit('join-room', new Join(room, undefined, existingUserId));
		})

		this.conn.on('you', (user:PrivateUserData) => {
			console.log('You:', user.name);
			this.me.value = user;

			if(!this.getUser()) {				
				this.saveUser();
			}
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

	downloadSong(song: string) {
		this.conn.emit('queue-song', {
			url: song,
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

	getUser() {
		return JSON.parse(window.localStorage.getItem('existingUser'));
	}
}
