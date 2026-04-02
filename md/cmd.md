# cmd:

le `cmd` est l'identifiant d’émission lié à une action. C'est une *string* qui peut être formé de plusieurs parties séparés par ":", (pour le moment que deux parties prises en comptes).

```javascript
cmd: "mqtt:myCmd"
```

Le premier élément est utilisé  comme identifiant de *handler* s'il est absent le *handler* sera `userCmd` pour les boutons / SVG / actions simples;

## io.Socket:

Pour ce `cmd`:
```javascript
cmd: "mqtt:myCmd"
```

Le message arrivera sur le *handleur*:
```javascript
socket.on ( "mqtt", function ( msg )
{
	// msg = {
	// 		"cmd":"myCmd",
	// 		"data":<Data>
	// }
});
```

pour ce cmd, le message arrivera sur le *handleur*:
```javascript
cmd: "myCmd"
```

```javascript
socket.on ( "userCmd", function ( msg )
{
	// msg = {
	// 		"cmd":"myCmd",
	// 		"data":<Data>
	// }
});
```

## socket maison:
dans le cas d'utilisation un gestionnaire maison, il faut que ce soit une classe héritant de l'`EventTarget` qui et ajouter un *listener* sur l'événement `userCmd`

```javascript
class WS extends EventTarget {
	constructor ( )
	{
		this._socket.addEventListener ( "userCmd", (data)=>{

		});
	}
}
```