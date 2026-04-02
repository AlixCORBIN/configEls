# csv:

L'element CSV n'affiche rien mais permet de créer un objet qui va loguer les donnés puis les mettre a disposition pour le telecahrgement.

```javascript
{
	type:"csv",
	separator:",", // séparateur utilisé pour la génération du CSV
	title:'Download CSV',
	prompt: true, // demande le nom du fichier de sortie
	file: undefined, // nom du fichier de sortie
	periode: 0, // période of data transmission
	max:{ // pour eviter l'augmentation infinie de la taille du CSV
		size: 1000000, /// taille maximun du CSV en octet si le champ de telechargement recurent n'est pas configuré
		time: undefined, // temps maximum d'enregistrement (h)
		line: undefined,
	},
	channel:{
		synchro:"CHANNEL TIME", // channel de synchro (horodatage)
		title:"chrono", // titre de la colone de synchro dans le CSV
		data:["DATA_1","DATA_2"], // channels de donnés
		titles:["TItle 1","Title 1"] // titres des colonnes dans le CSV
	}
}
````