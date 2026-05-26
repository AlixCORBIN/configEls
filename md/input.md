# input :

Créait un champ texte permettant de définir une interaction textuelle remontant du client ver le serveur.

## minimum:
```javascript
{
	type: "input",
	channel: "WEBSOCKET CHANNEL",
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
	valueType: <Data>, // cf Chapter valueType or :
		// - error set class error on data if value != 0
		// - obj cf section io.obj
	unit: <Data>, // cf Chapter valueType
	format: undefined // format d'envoi de données
	channel:"channelConfig",
	fieldConfig:{
		format: {
			dataId: "${value}"
		},
		event: undefined, // si c'est défini, attend un événement global a la page pour émettre les données, peut être généré par un bouton
		type: "number", // number, range, string, checkbox
		min: 0, // pour les number
		max: 12, // pour les number
		step: 0.1, // pour les number
		title: "string", 
	}
}
```
- `text_id` et `prefix` font références à la [traduction](traduction.md),
- `default` est la valeur affichée avant d'avoir reçu une donnée,
- `periode` est le type d'actualisation, la gestion de ce paramètre est dépendante du serveur,
- `valueType` permet de changer la gestion de la valeur a afficher cf [valueType](valueType.md),
- `unit` cf [`unit`](valueType.md#unit),
- `format` cf [format entrée](valueType.md#format),
- `fieldConfig`:
	- `channel` un *channel* qui reçoit la configuration sous format d'objet, `min` / `max` / `step` / ...,
	- `format` cf [format sortie](valueType.md#format),
	- `event` [ici](#ioE), permet l’émission des données en différé,
	- `type` défini le type d'entrée `number` / `range` / `string` / `checkbox`,
	- `min` valeur minimum (`number`),
	- `max` valeur maximum (`number`),
	- `step` incrément / décrément pour le changement à la sourie (`number`),
	- `title` texte affiché au survole de la sourie attention sera remplacé par les données issues du *channel* de config , 

Attention si `event` est présent alors le `format` n'est pas pris en compte.

le type `range` s'utilise comme le type `number`, il ne créait pas de champ à remplir mais un *slider* entre le min et le max