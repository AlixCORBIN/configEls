# dinTable:

Créait un tableau pouvant contenir un nombre variable de lignes et colonnes.
L'entête peut contenir des entrées de n'importe que type.

Le corps peut contenir un nombre variable de ligne est colonne généré à la volé en fonction des données reçues.

## minimum:
```javascript
{
	type:"dinTable",
	channel:"WEBSOCKET CHANNEL"
}
```

### options supplémentaires:
```javascript
{
	...
	periode:0,
	head:[
		{/*...*/}  // element 1 de la ligne 1
		{/*...*/}  // element 2 de la ligne 1
		{/*...*/}  // element 3 de la ligne 1
	]
}
```

- `periode` est le type d'actualisation, la gestion de ce paramètre est dépendante du serveur,
- `head` est la ligne d'entête,


## mise à jour totlae :

```javascript
{
	value:[
		[], // represente une ligne (sans donnée pour cet exemple)
		[
			{ // represente une colone avec style CSS
				value:"...",
				style:"..."
			},
			"..." // represente une colone de texte pur a afficher.
		],
	]
}
```

## mise à jour partielle :

```javascript
{
	update:[
		{
			id:0, // id de la ligne qui doit etre mise a jour
			value:[
				{ // represente une colone avec style CSS
					value:"...",
					style:"..."
				},
				"..." // represente une colone de texte pur a afficher.
			]
		}
	]
}
```