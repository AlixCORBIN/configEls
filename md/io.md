# io:

Créait un champ de texte qui sera mis à jour à partir des données envoyés par le socket défini par le *[channel](channel.md)*. Dans tous les cas cet élément travail dans le sens *serveur* vers *client*, il peut aussi travailler dans le sens [*client* vers *serveur*](#C2S) en changeant sa config.

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
}
```

- `text_id` et `prefix` font références a la [traduction](traduction.md),
- `default` est la valeur affichée avant d'avoir reçu une donnée,
- `periode` est le type d'actualisation, la gestion de ce paramètre est dépendante du serveur,
- `action` uniquement disponible quand le `channel` est un tableau `[]` cf [io Action](#ioA),
	- `"min"` : affiche la plus *petite* valeur de la table,
	- `"average"` : affiche la valeur *moyenne*,
	- `"max"` : affiche la plus *grande* valeur de la table,
- `valueType` permet de changer a gestion de la valeur a afficher cf [valueType](valueType.md),
- `unit` permet d'afficher une unité cf [unit](valueType.md#unit.md). `unit` peut être défini a `false` pour les données de type : `flow` / `volume` / `temp`, cela permet de ne pas afficher l’unité

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

## io.obj :

Dans certain cas nous voudrons afficher une donnée formaté a partir d'une structure ou objet. Dans ce cas il faut définir le format de sortie comme suis.

```javascript
{
	type: "io",
	channel: "channel_1",
	valueType: "obj",
	format: "du_Text_Avant ;label; : ;id;",
	...
}
```

Ici, le format déclare un texte `du_Text_Avant ` suivit d'une donnée issue de l'objet : `;label;`  puis un text ` : ` puis une nouvelle donnée `;id;`.

Pour compléter cette *string* il faut qyue la donnée fourni sur le *channel* `channel_1` soit un objet comme celui-ci :

```javascript
{
	label:<Data>,
	id:<Data>
}
```

Ainsi avec l’objet suivant :

```javascript
{
	label:"donnée",
	id:6
}
```

Nus obtenons la chaîne suivante : `du_Text_Avant donnée : 6`

Si vous observez bien les clés de l'objet sont utilisés comme identifiant dans le chaîne `format`, précédé et suivit d'un `;`.


## <a id='C2S' />Client -> Server:

Pour définir une interaction remontant du client ver le serveur, il faut ajouter le paramètre suivant.

```javascript
{
	domType: "output", // output/input/select cf section io.input / io.select
}
```

- `domType` peut prendre différentes valeurs
	- `output` valeur par défaut est est une sortie du serveur qui ne peut que afficher des données,
	- `input` qui est une entrée du serveur et qui sert à saisir une valeur  depuis un champ texte,
	- `select` qui est une entrée du serveur à partir d'une liste déroulante,

Le premier cas est celui expliqué plus haut, les deux suivant sont expliqués par la suite, chacun a ses paramètres additionnels spécifiques.

## io.input :

```javascript
{
	...
	domType: "input",
	inputConfig:{
		channel:"channelConfig",
		event: undefined, // si c'est défini, attend un événement global a la page pour émettre les données, peut être généré par un bouton
		type: "number", // number, string, checkbox
		min: 0, // pour les number
		max: 12, // pour les number
		step: 0.1, // pour les number
		title: "string", 
		format: undefined // format d'envoi de données
	}
}
```

- `channel` un *channel* qui reçoit la configuration, `min` / `max` / `step` / ...,
- `event` [ici](#ioE),
- `type` défini le type d'entrée `number` / `string` / `checkbox`,
- `min` valeur minimum (`number`),
- `max` valeur maximum (`number`),
- `step` incrément / décrément pour le changement à la sourie (`number`),
- `title` texte affiché au srvole de la sourie attention sera remplacé par les données issues du *channel* de config , 
- `format` [format](#ioF) de retour de données (client -> serveur),

## io.select:
Il est possible de définir l'io comme un select, auquel cas des données de configuration supplémentaire sont disponibles.

```javascript
{
	type:"io",
	...
	domType: "select",
	inputConfig:{
		channel:"channelOptions"
		event: undefined, // si c'est défini, attend un événement global a la page pour émettre les données, peut être généré par un bouton
		options: [], // éléments du select
		format: undefined // format d'envoi de données
	}
}
```

- `channel` un *channel* qui reçoit les options si elles ont besoin d’être chargé dynamiquement,
- `event` [ici](#ioE),
- `options` est un tableau de textes ou d'objets
	```javascript
	{
		value:<Data>,
		text:"label a afficher"
	}
	```
- `format` [format](#ioF) de retour de données (client -> serveur),

# <a id="ioE" />io.event :

Si un *id* est défini, attend un événement global à la page pour émettre les données, peut être généré par un [`bouton`](button.md),

# <a id="ioF" />io.format :

Attention le format est un objet ou une *string* représentant un objet qui sert sur les données d'entrée et de sortie, dans le cas ou on ne veut pas simplement envoyer une donnée brut:

Par exemple :

```javascript
format: {
	leLabel: "${value}"
}
```

si la valeur de l'input est `50` l'objet envoyé sera : `{"leLabel":"50"}`.