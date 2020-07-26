import pluginPkg from "../../package.json";
import Wysiwyg from "./components/Wysiwyg";
import pluginId from "./pluginId";

export default (strapi) => {
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: () => null,
    injectedComponents: [],
    isReady: true,
    isRequired: pluginPkg.strapi.required || false,
    leftMenuLinks: [],
    leftMenuSections: [],
    // menu: {
    //   pluginsSectionLinks: [
    //     {
    //       destination: `/plugins/${pluginId}`,
    //       icon: pluginPkg.strapi.icon,
    //       name: pluginPkg.strapi.name,
    //       label: {
    //         id: `${pluginId}.plugin.name`,
    //         defaultMessage: 'WYSIWYG'
    //       }
    //     }
    //   ]
    // },
    mainComponent: null,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    settings: null,
    trads: {},
  };

  strapi.registerField({ type: "wysiwyg", Component: Wysiwyg });

  return strapi.registerPlugin(plugin);
};
