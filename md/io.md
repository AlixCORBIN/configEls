# io:

Créait un champ de texte qui sera mis à jour à partir des données envoyés par le socket défini par le *[channel](channel.md)*. Cet élément travail dans le sens *serveur* vers *client*.

## minimum:
```javascript
{
	type:"io",
	channel:"WEBSOCKET CHANNEL"
}
```
## options supplémentaires:
```javascript
{
	label:"monLabel",
	text_id:"", // cf texte ID
	prefix: "",
	default:"...",
	periode:0, // temps de rafraîchissement
	action: "min", // "min" / "max" / "average" utile uniquement si channel est un tableau (cf section io.action)
	valueType: <Data>, // cf Chapter valueType or :
		// - error set class error on data if value != 0
		// - obj cf section io.obj
	unit: <Data>, // cf Chapter valueType
	format: undefined,
}
```

- `text_id` et `prefix` font références à la [traduction](traduction.md),
- `default` est la valeur affichée avant d'avoir reçu une donnée,
- `periode` est le type d'actualisation, la gestion de ce paramètre est dépendante du serveur,
- `action` uniquement disponible quand le `channel` est un tableau `[]` cf [io Action](#ioA),
	- `"min"` : affiche la plus *petite* valeur de la table,
	- `"average"` : affiche la valeur *moyenne*,
	- `"max"` : affiche la plus *grande* valeur de la table,
- `valueType` permet de changer la gestion de la valeur a afficher cf [valueType](valueType.md),
- `unit` cf [`unit`](valueType.md#unit),
- `format` cf [format](#valueType.md#format),

## <a id='ioA' />io.action :

Dans le cas ou l'on souhaite afficher la valeur la plus *petite* / *grande* ou *moyenne* entre plusieurs entrée, il est possible de définir la config comme suis :

```javascript
{
	type:"io",
	channel: [ "channel_1", "channel_2", ... ],
	action: "min",
	...
}
```

