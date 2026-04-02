# gauge:

Créait un un compteur avec une aiguille qui va varier en fonction de la donnée envoyée.

## minimum:
```javascript
{
	type:"gauge",
	channel:"WEBSOCKET CHANNEL",
	options: {
		values:[ 0, 100 ]
	}
}
```

L'object options est directement lié à l'objet [gauge](https://fhgitlab.lan.faureherman.com/submodules/javascript/gauge.js/-/tree/master?ref_type=heads), consulter la page dedié pour toutes les possibilitées.

## options supplémentaires:
```javascript
{
	...
	periode:0, // temps de rafraichissement
	valueType: <Data>, // cf Chapter valueType
	unit: <Data>, // cf Chapter valueTypet
	options:{
		...
	}
}
```

- `periode` est le type d'actualisation, la gestion de ce paramètre est dépendante du serveur,
- `valueType` permet de changer a gestion de la valeur a afficher cf [valueType](valueType.md),
- `unit` permet d'afficher une unité cf [unit](valueType.md#unit.md). `unit` peut être défini a `false` pour les données de type : `flow` / `volume` / `temp`, cela permet de ne pas afficher l’unité