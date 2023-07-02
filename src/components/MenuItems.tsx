import {
  TruckIcon,
  CalendarIcon,
  HomeIcon,
  UserGroupIcon,
  UserCircleIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArchiveBoxArrowDownIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  mobileView: boolean;
};

export const MenuItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="w-6 h-6" />,
    mobileView: false,
  },
  {
    label: "Users",
    href: "/users",
    icon: <UserGroupIcon className="w-6 h-6" />,
    mobileView: true,
  },
  {
    label: "Products",
    href: "/products",
    icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
    mobileView: true,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
    mobileView: true,
  },
  {
    label: "Vendors",
    href: "/vendors",
    icon: <TruckIcon className="w-6 h-6" />,
    mobileView: true,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: <UserCircleIcon className="w-6 h-6" />,
    mobileView: true,
  },
  {
    label: "Locations",
    href: "/locations",
    icon: <MapPinIcon className="w-6 h-6" />,
    mobileView: true,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Cog6ToothIcon className="w-6 h-6" />,
    mobileView: false,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <ChartBarIcon className="w-6 h-6" />,
    mobileView: false,
  },
  {
    label: "Scheduler",
    href: "/scheduler",
    icon: <CalendarIcon className="w-6 h-6" />,
    mobileView: false,
  },
  {
    label: "Archive",
    href: "/archive",
    icon: <ArchiveBoxArrowDownIcon className="w-6 h-6" />,
    mobileView: false,
  },
];
