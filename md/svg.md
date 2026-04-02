# svg:

Affiche un svg, et permet la colorisation d'items en fonction d'une donnée

## minimum:
```javascript
{
	type:"svg",
	src:"imgs/img.svg", // le svg lui même
}
````

## options supplémentaires:
```javascript
{
	backImg:"imgs/img.png", // arrière plan si besoin
	data:[
		{
			id:"id_Path1",
			type:"bin",
			channel:"WEBSOCKET CHANNEL",
			periode:0,
			revert: false, // complement a 1 sur la donnée
			mask: 0x01 // masque sur la donnée pour savori quel bits observer
		},
		{/*...*/}
	]
}
````

- `backImage` image d'arrière pla dans le cas d'un SVG transparent,
- `data` represente les données qui seront affiché sur le *svg*, les type sont `bin` et `multi`,
	- `id` fait reference à un l'id d'un élément dans le *svg*
	- `type` comment interpreter la donnée
	- `channel` l'identifiant de la donnée

## SVG:
```xml
<svg xmlns="http://www.w3.org/2000/svg"
    width="180mm"
    viewBox="0 0 1526 807">

  <path id="id_Path1" /*...*/ />
  <path id="id_Path2" /*...*/ />
  <path id="id_Path3" /*...*/ />
</svg>
```

#### en cours de travail :

```javascript
{
	type:"svg",
	/* ... */
	colors:{ // applicable à toutes les entrées de type bin en même temps
		undefined: "grey", // si la valeur n'est pas un nombre ou pas definie
		false: "red", // si la valeur masqué est 0
		true: "green", // si la valeur masqué est deferente de 0
	},
	data:[
		{
			id:"id_Path1",
			type:"bin",
			/* ... */
			onclik:
			{ // send over socket 'userCmd'
				cmd:"********", // cmd param
				toogle: false, // for bin only onclick toogle value of input and esend it 
				arg:{ // reserved
					value:undefined
				}
			},
			colors:
			{ // applicable que pour une entrée bin
				undefined: "grey", // si la valeur n'est pas un nombre ou pas definie
				false: "red", // si la valeur masqué est 0
				true: "green" // si la valeur masqué est deferente de 0
			},
		},
		{/*...*/}
	]
}
````

permet l'utilisation du SVG comme zone de click et de definir les valeurs de couleurs pour l'etat bin ( undefined / false / true )