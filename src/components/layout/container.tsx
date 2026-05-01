import { cn } from "@/utils/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function Container({ children, className }: Props) {
    return (
        <div
            className={cn(
                "mx-auto w-full px-2 sm:px-2 max-w-7xl 2xl:max-w-none",
                className
            )}
        >
            {children}
        </div>
    );
}