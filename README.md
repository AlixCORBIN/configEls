# utilisé pour généré l'IHM du FHSONIC:

Permet de générer à partir d'un fichier statique les différents éléments qui rempliront la page. C'est utilisé avec le module `Grid` qui  permettra, de placer les éléments dans la page.

## <a id="mainU"/> utilisation:

```javascript
{
	// tout cequi est ici, n'est pas utilisé par le module...
	// seul le dataset est necessaire
	dataset:[
		{/*...*/}, // item 1
		{/*...*/}, // item 2
		{/*...*/}, // item 3
		{/*...*/}  // item 4
	]
}
```

Les datasets se présentent comme suis :

```javascript
{
	class:"items", // classe parent à tous ce qui va suivre
	data:[ // description de ce qui devra être créé
		{/*...*/}, // element 1 de l'item X
		{/*...*/}, // element 2 de l'item X
		{/*...*/}  // element 3 de l'item X
	]
},
```

### base:
```javascript
{
	type:"type",
	style:"/* std css */",
	id:"element id"
}
```
Ces paramètres sont disponibles sur chacun des éléments suivant.

### <a id="mainL" />liste des éléménts:
- [title](md/title.md)
- [text](md/text.md)
- [img](md/img.md)
- [map](md/map.md)
- [table](md/table.md)
- [io](md/io.md)
- [text_id](md/translation.md#text)
- [title_id](md/translation.md#title)
- [bin](md/bin.md)
- [gauge](md/gauge.md)
- [dinTable](md/dinTable.md)
- [log](md/log.md)
- [svg](md/svg.md)
- [graph](md/graph.md)
- [csv](md/csv.md)
- [button](md/button.md)
