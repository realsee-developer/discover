import Link from "next/link";

const styles = {
  layout: "h-screen grid grid-cols-[240px_1fr]",
  sidebar: "border-r bg-gray-100/40",
  sidebarContent: "flex h-full max-h-screen flex-col gap-2",
  header: "flex h-[60px] items-center border-b px-6",
  headerLink: "flex items-center gap-2 font-semibold",
  headerIcon: "h-6 w-6",
  navigation: "flex-1 overflow-auto py-2",
  navGrid: "grid items-start px-4 text-sm font-medium",
  navLink: "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
  main: "flex flex-col overflow-scroll",
};

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.header}>
            <Link className={styles.headerLink} href="/dashboard">
              <span className={styles.headerIcon}>📊</span>
              <span>Dashboard</span>
            </Link>
          </div>
          <div className={styles.navigation}>
            <nav className={styles.navGrid}>
              <Link className={styles.navLink} href="/dashboard/summaries">Summaries</Link>
              <Link className={styles.navLink} href="/dashboard/account">Account</Link>
            </nav>
          </div>
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}


