import { RxDashboard } from "react-icons/rx";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiGalleryFill, RiProductHuntLine } from "react-icons/ri";
import { FaFirstOrder, FaUnity } from "react-icons/fa";
import { CgAttribution } from "react-icons/cg";
import {
  MdOutlineProductionQuantityLimits,
  MdBrandingWatermark,
  MdSettingsAccessibility,
  MdOutlineCategory,
} from "react-icons/md";
export const menuData = [
  {
    title: "Dashboard",
    icon: <RxDashboard />,
    path: "/dashboard",
  },
  {
    title: "Order",
    icon: <FaFirstOrder />,
    path: "/dashboard/order",
  },
  {
    title: "Banner",
    icon: <RiGalleryFill />,
    path: "/dashboard/banner",
   
  },
  {
    title: "Category",
    icon: <MdOutlineCategory />,
    path: "/dashboard/category",
  },
  {
    title: "Brand",
    icon: <MdBrandingWatermark />,
    path: "/dashboard/brand",
  },
  {
    title: "Product",
    icon: <MdOutlineProductionQuantityLimits />,
    path: "/dashboard/product",
     
  },

  {
    title: "Product Variant",
    icon: <RiProductHuntLine />,
    childrens: [
      {
        title: "Color",
        icon: <IoColorPaletteOutline />,
        path: "/dashboard/color",
      },
      {
        title: "Unit",
        icon: <FaUnity />,
        path: "/dashboard/unit",
      },
      {
        title: "Attribute",
        icon: <CgAttribution />,
        path: "/dashboard/attribute",
      },
      {
        title: "Product Variant",
        icon: <RiProductHuntLine />,
        path: "/dashboard/product-variant",
      },
    ],
  },
  {
    title: "WebSetting",
    icon: <MdSettingsAccessibility />,
    path: "/dashboard/web-setting",
  },
];
