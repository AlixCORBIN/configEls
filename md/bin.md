# bin :

Créait un texte qui sera colorisé en rouge / vert selon la donnée sur le *channel*, 0 : rouge, 1 : vert

## minimum:
```javascript
{
	type:"bin",
	channel:"WEBSOCKET CHANNEL"
}
```
## options supplémentaires:

```javascript
{
	...
	text:"texte affiché",
	periode:0,
	mask: 0x01, // masque a appliquer sur la donnée
	revert: false // inversion ou non de la donnée,
	color:[ // cf colors section
		"--color-inactive",
		"green"
	]
}
```
- `text` texte qui sera affiché,
- `periode` est le type d'actualisation, la gestion de ce paramètre est dépendante du serveur,
- `mask` est un masque binaire a exécuter sur la donnée entrante, permet d'avoir plusieurs statu sur une seule variable,
- `revert` permet d’interpréter la donnée en complément à 1,
- `color` est un tableau contenant deux [couleurs](color.md), `false` et `true` les [couleurs](color.md) possibles sont :


## Note :
Attention, le texte n'est pas directement colorisé, c'est une classe qui est ajouté ou non, `active` si `value & mask != revert?1:0`.

```CSS
.items .status {
	color: red;
}

.items .status.active {
	color: green;
}
```

La classe item est [définie](../README.md#mainU) dans sur l’élément parent.
La classe statu est définie par l'object *bin*
La classe active est définie en suivant la donnée

Dans le cas ou les couleurs sont définie manuellement c'est une variable (`--status-color`) qui est mise à jour. Il faut donc affecter cette variable au texte ou à un autre élément.

Pour exemple le CSS pourrait ressembler à ceci :

pour changer la couleur du texte
```CSS
.items.status {
  color: var(--status-color);
}
```

ou encore pour afficher un point devant le texte qui lui seul changera de couleur, effet led.
```CSS
.items.status::before {
  color: var(--status-color);
  content: "●";
  font-size: 1em;
}
```