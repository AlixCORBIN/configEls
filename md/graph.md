# graph:

Creait un element graph s'appuyant sur [chartjs](https://www.chartjs.org/) dont le code à été copié [ici](https://fhgitlab.lan.faureherman.com/submodules/javascript/chartjs)

Il existe trois types de graphs : `signal` / `sync` / `async`.

- `sync` sert a afficher différentes données avec un même abscisse,
- `async` sert à afficher plusieurs données qui n'ont pas forcement le même abcisse.
- `signal` sert à afficher une courbe complète à chaque donnée,

## sync:
```javascript
{
	type:"graph",
	subType:"sync", // sync/signaml/async
	channel:"WEBSOCKET CHANNEL X"
	periode:0,
	coef:1, // dans le cas ou le X doit etre modifié
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL Y",
			periode:0,
			color:"green",
		}
	]
}
```

## async:
```javascript
{
	type:"graph",
	subType:"async", // sync/signam/async
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL XY",
			periode:0,
			color:"green"
		}
	]
}
```

## signal:
```javascript
{
	type:"graph",
	subType:"signal", // sync/signaml/async
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL SIGNAL",
			periode:0,
			color:"green"
		}
	]
}
```

## options:
les  options sont les même pour tous les graphs :
```javascript
{
	type:"graph",
	subType:"sync", // sync/signam/async
	channel:"WEBSOCKET CHANNEL X",
	textColor:"black", // color of graph's text (cf Colors section)
	gridColor:"rgba(128,128,128,0.4)", // color of grid (cf Colors section)
	coef: 1, // coefficient multiplicateur pour la donnée en X
	xAxisType: "date", // type de donnée sur l'axe X (uniquement date / number pour le moment)
	periode:0,
	deep:300, // nombre de point de la courbe en X
	min:-1, // valeur minimum de de l'ordonnée'
	max:1, // valeur maximum de l'ordonnée
	zoom:true, // active le mode zoom
	zooOverView: true, // active ou desactive le graph de zoom du bas
	unit: false, // need to set to true if units are needed for at least one curve
	curve:[
		{
			name:"Courbe 1",
			channel:"WEBSOCKET CHANNEL Y",
			periode:0,
			deep:300,
			color:"green",
			tension:0.3,
			showLine:true,
			coef: 1, // coeficient multiplicateur pour la donnée en Y
			valueType: <Data>, // cf Chapter valueType
			unit: <Data> // cf Chapter valueType
		}
	],
	debounce:{ // temps minimum entre deux mise a jour des graphiques
		time:1000, // temps en ms
		active:true // actif ou non
	},
	csv:{
		exportable: false, // défini si le CSVpeut être exporté
		export: "event", // défini la façon dont l’export est déclenché (actuellement que le mode event)
		event: "exportToCSV", // l’événement qu'on attend pour exporter (sur le "document")
		prompt: false, // demande à l'utilisateur le nom du fichier de sortie
		file: undefined, // le ficher de sortie
		separator: ";", // le séparateur CSV
	}
}
```

## données:
Attention les données a transmettre ne sont pas les même en fonction des types de graphs :

- sync :` WEBSOCKET CHANNEL X` et `WEBSOCKET CHANNEL Y` sont de simple données numériques,
- async : `WEBSOCKET CHANNEL XY` est un objet au format : `{x: 2, y: 1.3}`,
- signal : `WEBSOCKET CHANNEL SIGNAL` est un table d'objets : `[{x: 1, y: 1.3},{x: 2, y: 1.6},{x: 3, y: 1.7},...]`

