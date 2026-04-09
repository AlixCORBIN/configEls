# select :

Créait une liste déroulante dont la donnée remonte du client ver le serveur.

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
	fieldConfig:{
		channel:"channelOptions"
		format: undefined, // format d'envoi de données
		event: undefined, // si c'est défini, attend un événement global a la page pour émettre les données, peut être généré par un bouton
		options: [], // éléments du select
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
	- `options` table contenant les valeurs sélectionnables
	- `title` texte affiché au survole de la sourie attention sera remplacé par les données issues du *channel* de config , 

## options :

C'est un tableau de textes ou d'objets, dans le cas d'un tableau de textes, la valeur remonté sera le texte lui même. Dans le cas d'un tableau d'objet, la donné rmonté est `value`, et le `text` quand a lui est affiché dans la liste déroulante.

```javascript
[
	{
		value:<Data>,
		text:"label a afficher"
	},
	...
]
```

