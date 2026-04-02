# valueType :
value type permet de déterminer comment doit être interpréter la donnée. Si le `valueType` est different de `<Number>` il est couplé à l'objet [`unit`](#unit), ainsi les valeurs disponibles sont :

- `<Number>` : un nombre, pour avoir un nombre de digit fixe,
- `"temp"` : température,
- `"volume"` : volume,
- `"flow"` : débit
- `"date"` : date en secondes
- `"dateMs"` : date en millisecondes


# <a id='unit' />unit :
L'objet unit sert a indiquer le type de donnée d'origine,

Pour que les types de données "flow" / "volume" / "temp", le module [unitManager](https://fhgitlab.lan.faureherman.com/submodules/javascript/unitmanager) est utilisé pour les conversions.

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
