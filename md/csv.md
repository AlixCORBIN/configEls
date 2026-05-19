# csv:

L'element CSV n'affiche rien mais permet de créer un objet qui va loguer les donnés puis les mettre à disposition pour le téléchargement.

## minimum:
```javascript
{
	type:"csv",
	channel:{ // ch
		type: "channel",
		...
	}
}
````
- `channel` object d configuration des donnée cf [channel](#channel),

## options supplémentaires:
```javascript
{
	periode: 0, // période of data transmission
	separator:",", // séparateur utilisé pour la génération du CSV
	title:'Download CSV',
	prompt: true, // demande le nom du fichier de sortie
	file: undefined, // nom du fichier de sortie
	max:{ // pour eviter l'augmentation infinie de la taille du CSV
		size: 1000000, /// taille maximun du CSV en octet si le champ de telechargement recurent n'est pas configuré
		time: undefined, // temps maximum d'enregistrement (h)
		line: undefined,
	},
	download: false,
	limitSelected: "size",
}
````

- `periode` est le type d'actualisation, la gestion de ce paramètre est dépendante du serveur,
- `separator` texte qui servira à séparer les colonnes du CSV,
- `title` titre affiché pour le CSV,
- `prompt` `true`/`false`, permette définir si un boite de dialogue doit être affiché lors du clic sur le bouton de téléchargement,
- `file` défini le nom par défaut du chier de sauvegarde du CSV, par défaut *CSV_<date>.csv*
- `max` défini les limites de taille pour les fichier CSV
	- `size` limite de taille en *Mo*
	- `time` limite de taille en temps *h*
	- `line`: limite de taille en lignes
- `download` `true`/`false` défini si le CSV doit être téléchargé automatiquement quand la limite est atteinte
- `limitSelected` défini la limite sélectionné par défaut


## <a id='channel' />channel:
les données peuvent être sous deux formes :
- `channel` : chaque donnée à un channel séparé, elle sont synchronisé par rapport à un channel spécifique
```javascript
{
	...
	channel:{
		type: "channel",
		synchro:"CHANNEL SYNCHRO", // channel de synchro (horodatage)
		title:"chrono", // titre de la colone de synchro dans le CSV
		data:["DATA_1","DATA_2"], // channels de donnés
		titles:["TItle 1","Title 1"] // titres des colonnes dans le CSV
	}
}
````

- `obj` : toutes les données sont dans un unique objet, un index sera automatiquement ajouter pour pouvoir les classer dans l'ordre de réception
```javascript
{
	...
	channel:{
		type: "obj",
		data:"CHANNEL DE DONNÉE", // channel de donnée
	}
}
````
dans ce dernier cas la donnée attendu sur le `channel.data` doit être au format : `{"label_1":<data>,"label_2":<data>,...}`, lors du téléchargement les titres de colonnes seront automatiquement généré a partir des label de l'objet. Incidemment l'objet doit toujours avoir les même paires `key`/`value`