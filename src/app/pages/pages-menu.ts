import { NbMenuItem } from "@nebular/theme";
export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Acceuil",
    icon: "home",
    link: "/home",
    home: true,
  },
  // {
  //   title: 'IoT Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  // },
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
            title: "Historique OF",
            link: "/pages/layout/infinite-list",
            icon: "clock",
          },
          {
            title: "Détails Impression",
            link: "/pages/layout/accordion",
            icon: "info",
          },
          // {
          //   title: "Tabs",
          //   pathMatch: "prefix",
          //   link: "/pages/layout/tabs",
          // },
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
  // {
  //   title: "UI Features",
  //   icon: "keypad-outline",
  //   link: "/pages/ui-features",
  //   children: [
  //     {
  //       title: "Grid",
  //       link: "/pages/ui-features/grid",
  //     },
  //     {
  //       title: "Icons",
  //       link: "/pages/ui-features/icons",
  //     },
  //     {
  //       title: "Typography",
  //       link: "/pages/ui-features/typography",
  //     },
  //     {
  //       title: "Animated Searches",
  //       link: "/pages/ui-features/search-fields",
  //     },
  //   ],
  // },
  // {
  //   title: "Modal & Overlays",
  //   icon: "browser-outline",
  //   children: [
  //     {
  //       title: "Dialog",
  //       link: "/pages/modal-overlays/dialog",
  //     },
  //     {
  //       title: "Window",
  //       link: "/pages/modal-overlays/window",
  //     },
  //     {
  //       title: "Popover",
  //       link: "/pages/modal-overlays/popover",
  //     },
  //     {
  //       title: "Toastr",
  //       link: "/pages/modal-overlays/toastr",
  //     },
  //     {
  //       title: "Tooltip",
  //       link: "/pages/modal-overlays/tooltip",
  //     },
  //   ],
  // },
  // {
  //   title: "Extra Components",
  //   icon: "message-circle-outline",
  //   children: [
  //     {
  //       title: "Calendar",
  //       link: "/pages/extra-components/calendar",
  //     },
  //     {
  //       title: "Progress Bar",
  //       link: "/pages/extra-components/progress-bar",
  //     },
  //     {
  //       title: "Spinner",
  //       link: "/pages/extra-components/spinner",
  //     },
  //     {
  //       title: "Alert",
  //       link: "/pages/extra-components/alert",
  //     },
  //     {
  //       title: "Calendar Kit",
  //       link: "/pages/extra-components/calendar-kit",
  //     },
  //     {
  //       title: "Chat",
  //       link: "/pages/extra-components/chat",
  //     },
  //   ],
  // },
  // {
  //   title: "Maps",
  //   icon: "map-outline",
  //   children: [
  //     {
  //       title: "Google Maps",
  //       link: "/pages/maps/gmaps",
  //     },
  //     {
  //       title: "Leaflet Maps",
  //       link: "/pages/maps/leaflet",
  //     },
  //     {
  //       title: "Bubble Maps",
  //       link: "/pages/maps/bubble",
  //     },
  //     {
  //       title: "Search Maps",
  //       link: "/pages/maps/searchmap",
  //     },
  //   ],
  // },
  // {
  //   title: "Charts",
  //   icon: "pie-chart-outline",
  //   children: [
  //     {
  //       title: "Echarts",
  //       link: "/pages/charts/echarts",
  //     },
  //     {
  //       title: "Charts.js",
  //       link: "/pages/charts/chartjs",
  //     },
  //     {
  //       title: "D3",
  //       link: "/pages/charts/d3",
  //     },
  //   ],
  // },
  // {
  //   title: "Editors",
  //   icon: "text-outline",
  //   children: [
  //     {
  //       title: "TinyMCE",
  //       link: "/pages/editors/tinymce",
  //     },
  //     {
  //       title: "CKEditor",
  //       link: "/pages/editors/ckeditor",
  //     },
  //   ],
  // },
  // {
  //   title: "Tables & Data",
  //   icon: "grid-outline",
  //   children: [
  //     {
  //       title: "Smart Table",
  //       link: "/pages/tables/smart-table",
  //     },
  //     {
  //       title: "Tree Grid",
  //       link: "/pages/tables/tree-grid",
  //     },
  //   ],
  // },
  // {
  //   title: "Miscellaneous",
  //   icon: "shuffle-2-outline",
  //   children: [
  //     {
  //       title: "404",
  //       link: "/pages/miscellaneous/404",
  //     },
  //   ],
  // },
  // {
  //   title: "Auth",
  //   icon: "lock-outline",
  //   children: [
  //     {
  //       title: "Login",
  //       link: "/auth/login",
  //     },
  //     {
  //       title: "Register",
  //       link: "/auth/register",
  //     },
  //     {
  //       title: "Request Password",
  //       link: "/auth/request-password",
  //     },
  //     {
  //       title: "Reset Password",
  //       link: "/auth/reset-password",
  //     },
  //   ],
  // },
];
