import Els from "./Els.js"

/// \brief read JSON config and create elements from it
export class View {

	#eventData = {
		// contient les données a envoyer sur evenement
	};

	#eventEmitter = {
		// contient les fonctions d'envoie sur evenement
	};

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
		this._popup = {
			new: {},
		};

		this.update ( );
	}

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
				let channel = c.channel;

				if ( 1 < channel.split ( ":" ).length )
				{
					channel = channel.split ( ":" ).slice ( 1 ).join ( ":" );
				}

				list[ channel ] = c.periode;
				if ( undefined != socket.on )
				{ // if we-re using socket.io
					socket.on ( channel, c.f );
				}
				else
				{ // if we're using basics websockets
					socket.addEventListener ( channel, c.f );
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

							let cmd = "data-set";
							let channel = c.channel;

							if ( 2 == c.channel.split ( ":" ).length )
							{
								cmd = c.channel.split ( ":" )[ 0 ];
								channel = c.channel.split ( ":" )[ 1 ];
							}

							let value = c.args?.domEl?.value;
							let format = c.args?.format;

							if ( format ) try
							{
								if ( format?.constructor.name )
								{
									format = JSON.stringify ( format );
								}

								value = eval ( '`'+format+'`' );
							}
							catch ( e )
							{
								console.log ( e )
							};

							socketEmiter ( cmd, {
								[ channel ]: value,
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
							let mainCmd = c.args.cmd.split ( ":" )[ 0 ];
							let data = {
								args:c.args.args
							};

							try
							{
								data.cmd = c.args.cmd.split ( ":" ).slice ( 1 ).join ( ":" );
								if ( 0 == data.cmd.length )
								{
									delete data.cmd;
								}
							}
							catch ( e ) {};

							socketEmiter ( mainCmd, data );
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
			ds.el.classList.add ( ...this._params.class );
			if ( ds.class )
			{
				ds.el.classList.add ( ds.class );
			}
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
	}

	new ( )
	{
		return this._getPopup ( "new" )
			.then ( ()=>{
				document.body.appendChild ( this._popup.new.dom );

				this._popup.new.dom.style.display = "";
				this._popup.new.items ||= [];

				this._popup.new.els.map ( c=>this._popup.new.els[ c.id ] = c );

				if ( this._params?.class )
				{
					this._popup.new.els.view_popup_new_dom.classList.add ( ...this._params.class );
				}

				this._popup.new.els.view_popup_new_ok.onclick = ()=>{
					this._newValidate ( );
					this._newClean ( );

					document.body.removeChild ( this._popup.new.dom );

					this.setIO ( );
				};

				this._popup.new.els.view_popup_new_wait.onclick = ()=>{
					document.body.removeChild ( this._popup.new.dom );
				}

				this._popup.new.els.view_popup_new_ko.onclick = ()=>{
					this._newClean ( );
					
					document.body.removeChild ( this._popup.new.dom );
				}

				this._popup.new.els.view_popup_new_add.onclick = ()=>{
					this._popup.new.items.push ( {} );
					addNewSelect ({
						outList: this._popup.new.els.view_popup_new_list,
						index:   this._popup.new.items.length - 1,
						div: {
							json:   this._popup.new.els.view_popup_new_json,
							config: this._popup.new.els.view_popup_new_config,
							out:    this._popup.new.els.view_popup_new_dom,
						},
						item: this._popup.new.items[ this._popup.new.items.length - 1 ],
					});
				};
			})
	}

	modify ( index )
	{
		return this.new ( )
			.then ( ()=>{
				this._popup.new.els.view_popup_new_width.value = this.config.dataset[ index ].x;
				this._popup.new.els.view_popup_new_height.value = this.config.dataset[ index ].y;

				// overwrite callback
				this._popup.new.els.view_popup_new_ok.onclick = ()=>{
					this._newValidate ( index );
					this._newClean ( );

					document.body.removeChild ( this._popup.new.dom );
				};
			})
			.then ( ()=>{
				this._popup.new.items = JSON.parse ( JSON.stringify ( this.config.dataset[ index ].data ) );

				this._popup.new.items.map ( (item,index)=>{
					addNewSelect ({
						outList: this._popup.new.els.view_popup_new_list,
						index:   index,
						type:    item.type,
						div: {
							json:   this._popup.new.els.view_popup_new_json,
							config: this._popup.new.els.view_popup_new_config,
							out:    this._popup.new.els.view_popup_new_dom,
						},
						item: item,
						objConfig: item,
					})
				})
			})
	}

	_getPopup ( name )
	{
		if ( this._popup[ name ] )
		{
			this._popup[ name ] = {}
		}

		if ( this._popup[ name ].dom )
		{
			return Promise.resolve ( this._popup[ name ].dom );
		}
		else
		{
			let path = new Error()
				.stack
				.split ( "\n" )
				.filter ( p=>p.indexOf("_getPopup@")>=0)[ 0 ];

			path = path.slice ( path.indexOf ( "http" ), path.lastIndexOf ( "/" ) );
			path = path+`/html/popup_`+name+`.html`;

			return fetch ( path )
				.then ( r=>{
					if ( r.ok )
					{
						return r.text ( );
					}
					else
					{
						throw "file not read";
					}
				})
				.then ( parseHTML )
				.then ( dom=>{
					this._popup[ name ].dom = dom.querySelector ( "#view_popup_new" );
					this._popup[ name ].els = [];

					this._popup[ name ].els.push ( ...dom.querySelectorAll ( "td" ) );
					this._popup[ name ].els.push ( ...dom.querySelectorAll ( "button" ) );
					this._popup[ name ].els.push ( ...dom.querySelectorAll ( "div" ) );
					this._popup[ name ].els.push ( ...dom.querySelectorAll ( "input" ) );

					this._popup[ name ].els = this._popup[ name ].els.filter ( cell=>cell.id );

					return dom;
				})
		}
	}

	_newValidate ( index )
	{
		let json = {
			x: Number ( this._popup.new.els.view_popup_new_width.value ),
			y: Number ( this._popup.new.els.view_popup_new_height.value ),
			data: [],
		};

		for ( let item of this._popup.new.items.filter ( i=>i ) )
		{
			json.data.push ( JSON.parse ( item.json.value ) );
		}

		if ( undefined != index )
		{
			this._config.dataset[ index ] = json;
		}
		else
		{
			this._config.dataset.push ( json )
		}

		this.update ( );

		document.dispatchEvent ( new Event ( "viewUpdate" ) );
	}

	_newClean ( )
	{
		[
			this._popup.new.els.view_popup_new_list,
			this._popup.new.els.view_popup_new_json,
			this._popup.new.els.view_popup_new_config,
			this._popup.new.els.view_popup_new_dom,
		].map ( d=>{
			while ( d.firstChild )
			{
				d.removeChild ( d.lastChild );
			}
		});

		this._popup.new.items = [];
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
}

export class Config extends EventTarget {
	constructor ( params )
	{
		super ( );

		this._config = _objMerge ( this.defaultConfig, params );
	}

	load ( id )
	{
		return this._loadMem ( id )
			.catch ( ()=>this._loadFile ({
				id
			}))
			.then ( r=>{
				if ( "views" != id )
				{
					return r;
				}

				this._config.views = this._config.views.map ( (c,i)=>new View ( c, "V_"+i, this._config ) );

				return this;
			})
			.catch ( r=>console.log( "error", r ) )
	}

	export ( )
	{

	}

	save ( )
	{
		if ( !this._config?.cookies?.views )
		{
			return Promise.reject ( "can't save cookie name not defined" );
		}

		localStorage.setItem ( this._config.cookie.views, JSON.stringify ( this.views.map ( v=>v.config ) ) );

		return Promise.resolve ( );
	}

	_loadMem ( id )
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
	_loadFile ( params )
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
						p = this._loadFile ( {
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
			viewIndex: 0,
			class: undefined,
			units: undefined,
		};
	}

	get views ( )
	{
		return this._config.views;
	}

	get view ( )
	{
		return this.views[ this.index ];
	}

	get index ( )
	{
		return this._config.viewIndex || 0;
	}

	set index ( value )
	{
		if ( isNaN ( value ) )
		{
			return;
		}

		this._config.viewIndex = Number ( value ) % this.views.length;
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

function parseHTML ( markup )
{
	if (markup.toLowerCase().trim().indexOf('<!doctype') === 0)
	{
		var doc = document.implementation.createHTMLDocument("");
		doc.documentElement.innerHTML = markup;
		return doc;
	}
	else if ('content' in document.createElement('template'))
	{
		// Template tag exists!
		var el = document.createElement('template');
		el.innerHTML = markup;
		return el.content;
	}
	else
	{
		// Template tag doesn't exist!
		var docfrag = document.createDocumentFragment();
		var el = document.createElement('body');
		el.innerHTML = markup;
		
		for (i = 0; 0 < el.childNodes.length;)
		{
			docfrag.appendChild(el.childNodes[i]);
		}	
		return docfrag;
	}
}

function addNewSelect ( params = {} )
{
	let timer = undefined;
	let selector = document.createElement( "select" );
	selector.id = params?.index;

	selector.onchange=(ev)=>{
		params.change = true;
		params.type = ev.target.value;
		getElsNewDom( params );
	};
	selector.onmouseover=(ev)=>{
		timer = setTimeout ( ()=>{
			params.change = false;
			getElsNewDom ( params );
		}, 200 );
	};
	selector.onmouseleave = (ev)=>{
		clearTimeout ( timer );
	}

	for ( let k of Object.keys ( Els ) )
	{
		if ( !Els[ k ].canCreateNew ( ) )
		{
			continue;
		}
		let option = document.createElement( "option" );
		option.value = k;
		option.innerHTML = k;

		selector.appendChild ( option );
	}
	if ( params?.type )
	{
		selector.value = params?.type;
	}
	else
	{
		params.type = selector.value;
	}

	let button = document.createElement( "button" );
	button.appendChild ( document.createTextNode ( " - " ) );
	button.onclick = (ev)=>{
	}

	let div = document.createElement( "div" );
	div.appendChild ( selector );
	div.appendChild ( button );

	params.change = true;

	getElsNewDom ( params )

	params.outList.appendChild ( div );
}

async function getElsNewDom ( params )
{
	let oldOut = undefined;

	if ( params.change )
	{
		let nItem = await Els[ params.type ]
			.new ({
				jsonDiv:  "view_popup_new_json",
				configDiv:"view_popup_new_config",
				outDiv:   "view_popup_new_dom",
				index: params.index,
				class: params.type,
				channels: []
			}, params.objConfig );

		if ( !nItem?.out )
		{
			console.error ( "error a item creatiion" );
			return;
		}

		if ( params.item.out )
		{
			params.item.out.replaceWith ( nItem.out );
		}
		else
		{
			params.div.out.appendChild ( nItem.out );
		}

		Object.assign ( params.item, nItem );
	}

	while ( params.div.json.firstChild )
	{
		params.div.json.removeChild ( params.div.json.lastChild );
	}

	while ( params.div.config.firstChild )
	{
		params.div.config.removeChild ( params.div.config.lastChild );
	}

	params.div.config.appendChild ( params.item.config );
	params.div.json.appendChild ( params.item.json );
}