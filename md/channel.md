# channel:

le `channel` est l'identifiant de la donnée en réception ou émission. Dans tous les cas c'est une *string* qui peut être formé de plusieurs parties séparés par ":", (pour le moment que deux parties prises en comptes).

```javascript
channel: "mqtt:/path/to/my/data"
```

pour les `channel` d'entrées le premier élément est ignoré ainsi dans l'exemple précédent pour une donnée d'entrée seul `/path/to/my/data` sera utilisé.

pour les `channel` de sorties le premier élément est utilisé  comme identifiant de *handler* s'il est absent le *handler* sera `data-set` pour les données saisie par l'utilisateur.

## io.Socket:

Pour ce `channel`:
```javascript
channel: "mqtt:/path/to/my/data"
```

Le message arrivera sur le *handler*:
```javascript
socket.on ( "mqtt", function ( msg )
{
	// msg = {
	// 		"/path/to/my/data":<Data>
	// }
});
```

Pour ce `channel`:
```javascript
channel: "/path/to/my/data"
```

Le message arrivera sur le *handleur*:
```javascript
socket.on ( "data-set", function ( msg )
{
	// msg = {
	// 		"/path/to/my/data":<Data>
	// }
});
```

## socket maison:
dans le cas d'utilisation un gestionnaire maison, il faut que ce soit une classe héritant de l'`EventTarget` qui et ajouter un *listener* sur l'événement `data-set`

```javascript
class WS extends EventTarget {
	constructor ( )
	{
		this._socket.addEventListener ( "data-set", (data)=>{

		});
	}
}
```
