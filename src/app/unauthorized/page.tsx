export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 text-center shadow-lg">
                {/* Title */}
                <h1 className="text-2xl font-bold text-red-600">
                    Unauthorized
                </h1>

                {/* Description */}
                <p className="text-sm text-gray-600">
                    You do not have permission to access this page.
                </p>

                {/* Action */}
                <a
                    href="/dashboard"
                    className="inline-block w-full rounded-lg bg-black py-2 text-sm font-medium text-white transition hover:bg-gray-900"
                >
                    Go back to Dashboard
                </a>
            </div>
        </div>
    );
}
