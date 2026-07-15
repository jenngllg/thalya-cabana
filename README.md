# Thalya Cabana

Menu mobile multilingue du kiosque Thalya Cabana à Cannes. Le projet est un site statique sans framework, dépendance d’exécution, compilation ni ressource distante.

## Propositions

- `index.html` : accueil comparateur des trois directions visuelles.
- `riviera.html` : version Riviera éditoriale avec navigation par onglets.
- `bistrot.html` : version Bistrot moderne avec rubriques repliables.
- `illustre.html` : version illustrée avec raccourcis visuels.

Les données du menu, les prix et les traductions sont mutualisés dans `assets/menu-data.js` et `assets/i18n.js`.

La version Bistrot utilise une sélection d’icônes Lucide stockées localement dans `assets/lucide/`. Leur licence ISC est incluse dans `assets/lucide/LICENSE` ; aucun CDN ni paquet à installer n’est utilisé.

## Prévisualisation locale

Depuis la racine du projet :

```powershell
node dev-server.cjs
```

Ouvrir ensuite `http://localhost:8000/`. Le petit serveur utilise uniquement les modules natifs de Node.js : aucun paquet n’est à installer.
