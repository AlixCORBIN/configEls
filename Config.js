import Els from "./Els.js"

/// \brief read JSON config and create elements from it
export class View {
	/// \param | in ] config : JSoN object who represent HMI (see README for full details)
	/// \param | in ] id : base ID of every element created
	/// \param [ in ] params : config parameters
	constructor ( config, id, params )
	{
		if ( ( undefined == config )
			|| ( undefined == id ) )
		{
			return;
		}

		this._callbacksFunctions = []; ///< array with all elements callback {periode: Number, channel: String, f: function }
		this._config = config;
		this._id = id;
		this._params = params;
		this._entries = [];

		this.update ( );
	}

	///\return array of callback elements
	get callbacks ( )
	{
		return this._callbacksFunctions || [];
	}

	/// \return clean config object, who could be used to create new "Config"
	get config ( )
	{
		let conf = JSON.parse ( JSON.stringify ( this._config ) );
		for ( let i = 0; i < conf.dataset.length; i++ )
		{
			delete conf.dataset[ i ].el; // remove main div
			delete conf.dataset[ i ].cel; // remove grid div
			if ( undefined == conf.dataset[ i ].data )
			{
				delete conf.dataset.splice ( i , 1 ) // remove empty dataset element
				i--;
			}
		}
		return conf;
	}

	/// \return clean object, with domEls inside
	get els ( )
	{
		return this._config;
	}

	#eventData = {
		// contient les données a envoyer sur evenement
	};

	#eventEmitter = {
		// contient les fonctions d'envoie sur evenement
	};

	/// \brief add event listener on channel (fromm callback) to get data from a socket
	/// \param [ in ] socket : input socket
	///     can be a basic websocket or an IO socket from socket.io
	/// \param [ in ] clean : define if clean or not previously defined event and data
	/// \return the list of listenned data
	setIO ( socket, clean = true )
	{
		if ( clean )
		{
			// remove all previously define event listener
			// and clean remaining data
			for ( let eventName in this.#eventEmitter )
			{
				document.removeEventListener ( c.args?.event, this.#eventEmitter[ c.args?.event ] );
			}

			this.#eventData = {};
			this.#eventEmitter = {};
		}

		function socketEmiter ( src, data )
		{
			if ( "" == src )
			{ // no output cmd
			}
			else if ( undefined != socket.on )
			{ // if we-re using socket.io
				socket.emit ( src, data );
			}
			else
			{ // if we're using basics websockets
				let event = new Event ( src );

				event.data = data;

				socket.dispatchEvent ( event );
			}
		}

		if ( undefined == socket )
		{
			return [];
		}

		let list = {};
		for ( let c of this._callbacksFunctions )
		{
			if ( c.channel )
			{
				list[ c.channel ] = c.periode;
				if ( undefined != socket.on )
				{ // if we-re using socket.io
					socket.on ( c.channel, c.f );
				}
				else
				{ // if we're using basics websockets
					socket.addEventListener ( c.channel, c.f );
				}
			}

			// if this object should manage to some event in/out
			switch ( c.eventType )
			{
				case undefined:
				{
					break;
				}
				case "input":
				{
					if ( c.args?.event )
					{
						c.args.domEl.removeEventListener ( "change", c.fnOnInput );
						c.args.domEl.addEventListener ( "change", c.fnOnInput = ()=>{
							if ( !this.#eventData[ c.args.event ] )
							{
								this.#eventData[ c.args.event ] = {};
							}

							this.#eventData[ c.args.event ][ c.channel ] = c.args.domEl.value;

							if ( this.#eventEmitter[ c.args.event ] )
							{
								return;
							}

							this.#eventEmitter[ c.args.event ] = ()=>{
								if ( 0 == Object.keys ( this.#eventData[ c.args?.event ] ).length )
								{
									return;
								}

								socketEmiter ( "data-set", this.#eventData[ c.args?.event ]);
								this.#eventData[ c.args?.event ] = {};
							};

							document.addEventListener ( c.args?.event, this.#eventEmitter[ c.args?.event ] );
						});
					}
					else
					{
						c.args.domEl.removeEventListener ( "change", c.fnOnInput );
						c.args.domEl.addEventListener ( "change", c.fnOnInput = ()=>{
							socketEmiter ( "data-set", {
								[ c.channel ]: c.args?.domEl?.value,
							});
						});
					}
					break;
				}
				case "in":
				{
					document.removeEventListener ( c.args.event, c.fnOnEvent );
					document.addEventListener ( c.args.event, c.fnOnEvent = (ev)=>{
						c.args.cb ( ev.value );
					});
					break;
				}
				case "out":
				{
					c.args.domEl.removeEventListener ( "click", c.fnOnClick );
					c.args.domEl.addEventListener ( "click", c.fnOnClick = ()=>{
						if ( c.args.cmd )
						{
							socketEmiter ( "userCmd", {cmd:c.args.cmd, args:c.args.args} );
						}

						if ( c.args.event )
						{
							let ev = new Event ( c.args.event );
							ev.value = c.args.args;
							document.dispatchEvent ( ev );
						}
					});
					break;
				}
			}
		}

		return list;
	}

	/// \brief create elements displayed folowing the config
	/// \note the config should be updated externaly
	update ( )
	{
		if ( "Array" !== this._config?.dataset?.constructor.name )
		{
			return;
		}

		// create all elements once
		for ( let [i,ds] of this._config.dataset.entries() )
		{
			if ( ds.el )
			{ // element already creted
				continue;
			}

			// create main elements
			ds.el = document.createElement ( "div" );
			ds.el.className = ds.class;
			ds.el.style = ds.style;
			ds.el.title = ds.name || "";
			
			if ( !ds.data )
			{ // not data available 
				continue;
			}

			let entries = [];

			for ( let [j,da] of ds.data.entries() )
			{
				if ( !Els[ da.type ] )
				{ // data type unknow
					continue;
				}

				// define ID + dataset index + data in dataset index 
				let uId = this._id+"_"+i+"_"+j;

				if ( da?.unit
					&& this._params?.units )
				{
					da.unitCurrent = this._params.units;
				}

				// create sub elements
				let entry = new Els[ da.type ]( da, uId );

				// add it to the maine one
				ds.el.appendChild ( entry.dom );

				this._callbacksFunctions.push ( ...entry.callbacks );
				entries.push ( entry );
			}
			
			this._entries.push ( entries );
		}

		console.log ( this._callbacksFunctions )
	}
}

export class Config extends EventTarget {
	constructor ( params )
	{
		super ( );

		this._config = _objMerge ( this.defaultConfig, params );
	}

	load ( id )
	{
		return this.loadMem ( id )
			.catch ( ()=>this.loadFile ({
				id
			}))
			.then ( r=>{
				if ( "views" != id )
				{
					return r;
				}

				this._config.views = this._config.views.map ( (c,i)=>new View ( c, "V_"+i, {} ) );

				return this;
			})
			.catch ( r=>console.log( "error", r ) )
	}

	loadMem ( id )
	{
		if ( !this._config?.cookies?.[ id ] )
		{
			return Promise.reject ( );
		}

		let ret = localStorage.getItem ( this._config?.cookies?.[ id ] );

		if ( !ret )
		{
			return Promise.reject ( );
		}

		try
		{
			this._config.views = JSON.parse ( ret );
		}
		catch ( err )
		{
			let e = new Event ( "error" );
			e.msg = "failed to parse config in cookie";

			return Promise.reject ( );
		}

		this._config.status[ id ] = "mem";
		return Promise.resolve ( );
	}

	/// \brief load config from external file
	loadFile ( params )
	{
		params = Object.assign ( {
			force: false,
			file: this._config?.files?.[ params.id ],
			path: this._config?.files?.path || "",
		}, params );

		if ( this._config?.[ params.id ]
			&& !params.force )
		{
			return Promise.reject ( "data already exist for object : "+params.id );
		}

		if ( !params.file )
		{
			return Promise.reject ( "no file name for object : "+params.id );
		}

		return fetch ( params.path + params.file )
			.then ( r=>{
				if ( r.ok )
				{
					return r.text ( )
				}
				else
				{
					throw "File "+params.path+params.file+" can't be read"
				}
			})
			.then ( eval )
			.then ( r=>{
				if ( "Array" == r.constructor.name )
				{
					return r;
				}
				else
				{
					throw params.file+" has invalide struct, need to ba a primitive array of object"
				}
			})
			.then ( data=>{
				let promises = [];
				data.map ( d=>{
					let p = undefined;
					if ( d.file )
					{
						p = this.loadFile ( {
								force:true,
								file: d.file,
								path: params.path
							})
							.then ( r=>d.dataset = r );
					}
					else
					{
						p = Promise.resolve ( );
					}
					promises.push ( p )
				});

				return Promise.all ( promises )
					.catch ( console.error )
					.then ( ()=>data )
			})
			.then( data=>{
				if ( params.id )
				{
					this._config[ params.id ] = data;
					this._config.status[ params.id ] = "file";
				}
				return data;
			})
	}

	export ( )
	{

	}

	save ( id )
	{
		if ( !this._config?.cookies?.[ id ] )
		{
			return Promise.reject ( "can't save cookie name not defined" );
		}

		localStorage.setItem ( this._config.cookie[ id ], JSON.stringify ( json ) );

		return Promise.resolve ( );
	}

	get defaultConfig ( )
	{
		return {
			cookies: {
				views: undefined,
			},
			files: {
				path: "/db/",
				views: undefined,
			},
			views: undefined,
			status: {
				views: undefined,
			},
		};
	}

	get views ( )
	{
		return this._config.views
	}
}

/// \brief Merge two elements to e new one
/// \param[ in ] obj1 : base object 
/// \param[ in ] obj2 : second object
/// \note if obj1.foo and obj2.foo exist obj2 will overwrite obj1 in the new one
/// \note be care obj1 use a deep copy, obj2 overwrite it with shadowcopy
function _objMerge ( obj1, obj2 )
{
	let d = {...obj1};

	for ( let s in obj2 )
	{
		switch ( obj2[s]?.constructor.name )
		{
			case "Object":
			{
				if ( !d[s] )
				{ // if property doesn't exist deep cpy
					d[s]=obj2[s];
				}
				else
				{
					d[s] = _objMerge ( obj1[s], obj2[s] );
				}
				break;
			}
			case "Array":
			{
				d[s]=obj2[s];
				break;
			}
			default:
			{
				console.log( obj2[s].constructor.name )
			}
			case 'Boolean':
			case 'Number':
			case 'String':
			{
				d[s]=obj2[s];
				break;
			}
			case undefined:
			{
				break;
			}
		}
	}

	return d
}