import { NbMenuItem } from "@nebular/theme";
export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Acceuil",
    icon: "home",
    link: "/home",
    home: true,
  },
  {
    title: " UAP 1",
    expanded: true,
    icon: { icon: "industry", pack: "fa" },
    children: [
      {
        title: "S500 - Atelier Protection Thermique",
        expanded: true,

        children: [
          {
            title: "Gestion Produits",
            link: "/pages/apt/gestionProduits",
            icon: "cube",
          },
          {
            title: "Création Etiquettes",
            link: "/pages/apt/CreationEtiquette",
            icon: "edit-2-outline",
          },
          {
            title: "Impression Etiquettes",
            link: "/pages/apt/ImpressionEtiquettes",
            icon: "printer-outline",
          },
          {
            title: "Détails Impression",
            link: "/pages/apt/DetailImpression",
            icon: "info",
          },
          {
            title: "Historique OF",
            link: "/pages/apt/HistoriqueOF",
            icon: "clock",
          },
          {
            title: "Vérification des étiquettes",
            link: "/pages/apt/ControlEtiquette",
            icon: "checkmark-circle-outline",
          },
        ],
      },
    ],
  },

  {
    title: "Importation des données",
    icon: { icon: "database", pack: "fa" },
    expanded: true,
    children: [
      {
        title: "Import Données a partir de CSV",
        link: "/pages/forms/inputs",
        icon: { icon: "file-csv", pack: "fa" },
      },
      {
        title: "Import Données a partir de DB",
        link: "/pages/forms/layouts",
        icon: { icon: "download", pack: "fa" },
      },
      {
        title: "Ajout Nouveau Table",
        link: "/pages/forms/buttons",
        icon: { icon: "table", pack: "fa" },
      },
    ],
  },
];
