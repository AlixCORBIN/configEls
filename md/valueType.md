# valueType :
```javascript
{
	...
	valueType: <Data>,
	unit: <Data>,
	format: undefined,
}
```

value type permet de déterminer comment doit être interpréter la donnée. Si le `valueType` est different de `<Number>` il est couplé à l'objet [`unit`](#unit), et [`format`](#format), ainsi les valeurs disponibles sont :

- `<Number>` : un nombre, pour avoir un nombre de digit fixe,
- `"temp"` : température,
- `"volume"` : volume,
- `"flow"` : débit
- `"date"` : date en secondes
- `"dateMs"` : date en millisecondes
- `"obj"` : donnée arrivant sous forme d'objet au format JSON, l'objet [`format`](#format) lui est lié,

# <a id='unit' />unit :
L'objet unit sert à indiquer le type de donnée d'origine,

Pour que les types de données "flow" / "volume" / "temp", le module [unitManager](https://fhgitlab.lan.faureherman.com/submodules/javascript/unitmanager) est utilisé pour les conversions.

Peut être défini à `false` pour les données de type : `flow` / `volume` / `temp`, cela permet de ne pas afficher l’unité

Il faut qu'une variable "unit" globale exite, permetant d'indiquer l'unité dans laquel doit être convertie la donnée :
```javascript
let unit = {
	volume:"m3", // unité de volume
	flow_v:"m3", // unité de volume pour le débit
	flow_t:"s", // unité de temps pour le débit
	temperature:"C" // unitée de temperature
}
````

## unit & valueType :
```javascript
{
	...,
	valueType: 1,
	unit: "%"
}
```

```javascript
{
	...,
	valueType: "temp",
	unit: {
		temperature: "C" || "K" || "F"
	}
}
```

```javascript
{
	...,
	valueType: "volume",
	unit: {
		volume: "b" || "g" || "l" || "m3"
	}
}
```

```javascript
{
	...,
	valueType: "flow",
	unit: {
		flow_v: "b" || "g" || "l" || "m3",
		flow_t: "s" || "m" || "h" || "d"
	}
}
```

```javascript
{
	...,
	valueType: "date" || "dateMs",
}
```

#  <a id='unit' />format :

## entrée :
Dans certain cas la donnée arriavnt est encapsulé dans un JSON, nous voudrons alors afficher tout out partie de la donnée formaté. Dans ce cas il faut définir le format de sortie comme suis.

```javascript
{
	valueType: "obj",
	format: "du_Text_Avant ${label} : ${id}",
	...
}
```

Ici, le format déclare un texte `du_Text_Avant ` suivit d'une donnée issue de l'objet : `${label}`  puis un text ` : ` puis une nouvelle donnée `${id}`.

Pour compléter cette *string* il faut que la donnée fourni sur le *channel* `channel_1` soit un objet comme celui-ci :

```javascript
{
	label:<Data>,
	id:<Data>,
	...
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

Si vous observez bien les clés de l'objet sont utilisés comme identifiant dans le chaîne `format`, encadré par `${` et `}`.

## sortie :

Dans le cas d'une donnée sortante il est aussi possible de definir le format de sortie des données comme suis :

```javascript
{
	...
	outputConfig: {
		format: {
			dataId: "${value}",
		},
		...
	}
}
```

ici `${value}` sera remplacé par la veleur issue de l'input ou du select associé, et un JSON sera envoyé, ainsi pour une aisié d value `23.5`, sera renvoyé : `{"dataId":"23.5"}`. dataId etant un text permettant d'identifier une donnée.
