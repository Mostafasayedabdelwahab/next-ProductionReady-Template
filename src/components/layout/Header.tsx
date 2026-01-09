import Link from "next/link";
import AuthSection from "./AuthSection";

export default function Header() {
    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="text-lg font-bold">
                    MiniSaaS
                </Link>

                <AuthSection />
            </div>
        </header>
    );
}
