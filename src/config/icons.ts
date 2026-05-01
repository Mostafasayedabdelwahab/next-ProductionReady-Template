import {
  Home,
  LayoutDashboard,
  Activity,
  User,
  Users,
  UserCog,
  Key,
  Briefcase,
  FolderKanban,
  ClipboardList,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Bell,
  ShoppingCart,
  CreditCard,
  Wallet,
  BarChart,
  Globe,
  Target,
  Rocket,
  Star,
  ShieldCheck,
  AlertTriangle,
  Settings,
  HelpCircle,
  Eye,
  Clock,
  Timer,
} from "lucide-react";

export const ICONS = {
  // 🏠 GENERAL / NAVIGATION
  home: Home,
  dashboard: LayoutDashboard,
  activity: Activity,

  // 👤 USERS & AUTH
  user: User,
  users: Users,
  "user-cog": UserCog,
  key: Key,

  // 💼 WORK / PROJECTS
  briefcase: Briefcase,
  "folder-kanban": FolderKanban,
  "clipboard-list": ClipboardList,
  folder: FolderKanban,

  // 📄 CONTENT
  "book-open": BookOpen,
  "file-text": FileText,
  image: ImageIcon,

  // 💬 COMMUNICATION
  mail: Mail,
  message: MessageSquare,
  bell: Bell,

  // 🛒 E-COMMERCE / PAYMENTS
  "shopping-cart": ShoppingCart,
  "credit-card": CreditCard,
  wallet: Wallet,

  // 📊 ANALYTICS / MARKETING
  "bar-chart": BarChart,
  globe: Globe,
  target: Target,
  rocket: Rocket,
  star: Star,

  // 🔐 SECURITY
  "shield-check": ShieldCheck,
  "alert-triangle": AlertTriangle,

  // ⚙️ SETTINGS / SYSTEM
  settings: Settings,
  "help-circle": HelpCircle,
  eye: Eye,

  // ⏱️ TIME
  clock: Clock,
  timer: Timer,
} as const;

export type IconName = keyof typeof ICONS;
