import { io, Socket } from 'socket.io-client';
import { Ref, ref, UnwrapRef } from 'vue';

export class RoomConnection {

	private conn: Socket;
	private queue: Ref<any[]>;
	private currentSong: Ref<object|null>;
	private users: Ref<any[]>;
	private me: Ref<object|undefined>;

	constructor(room: number, queue: Ref<UnwrapRef<any[]>>, currentSong: Ref<UnwrapRef<object | null>>, users: Ref<any>, me: Ref<object | undefined>) {
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
			this.conn.emit('join-room', { room });
		})

		this.conn.on('disconnected', () => {
			console.log('Disconnected');
		})

		this.conn.on('users', users => {
			console.log('Users update:', users);
			this.users.value = users;
		});

		this.conn.on('current-song', data => {
			console.log('Current song', data);
			this.currentSong.value = data;
		})

		this.conn.on('you', user => {
			console.log('You:', user);
			this.me.value = user;
		})

		this.conn.on('queue', queue => {
			console.log('The queue:', queue);
			this.queue.value = queue;
		})

		this.conn.on('notice', notice => console.log(notice));

		console.log(this.conn);

		this.conn.connect();
	}





}



