# button:

Élément qui génère un bouton qui peut au choix, envoyer une commande, ou émettre un événement global pour la page.

```javascript
{
	type: "button",
	options:[
		{
			label:{
				txt:"X",
				style:"",
				classList:[],
			},
			button:{
				txt:"Y",
				style:"",
				classList:[],
			},
			cmd:"dataLogger"
			event: myCmd, // l'event qui sera emis sur la globalité de la page
		}
	]
}
```

- `style` : can be undefined
- `classList` : can be undefined

si `cmd` n'est pas défini seul l'événement de page sera fonctionnel et inversement.