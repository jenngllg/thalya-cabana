# Thalya Cabana

Menu mobile multilingue du kiosque Thalya Cabana à Cannes. Le projet est un site statique sans framework, dépendance d’exécution, compilation ni ressource distante.

## Structure

- `index.html` : menu Bistrot moderne, page unique du site.
- `assets/menu-data.js` : catégories, produits et prix.
- `assets/i18n.js` : interface et traductions en neuf langues.
- `assets/app.js` : changement de langue, navigation et rubriques mobiles.
- `assets/base.css` et `assets/bistrot.css` : styles mobile-first.

Toutes les icônes sont stockées localement dans `assets/icons/`. La licence ISC des icônes Lucide est incluse dans `assets/icons/LUCIDE-LICENSE` ; aucun CDN ni paquet à installer n’est utilisé.

## Prévisualisation locale

Depuis la racine du projet :

```powershell
node dev-server.cjs
```

Ouvrir ensuite `http://localhost:8000/`. Le serveur utilise uniquement les modules natifs de Node.js.
