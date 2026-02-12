export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in">
            <h1 className="text-3xl font-bold text-destructive">Authentication Error</h1>
            <p className="text-muted-foreground max-w-md">
                There was a problem authenticating your account. Please try signing in again.
            </p>
            <a
                href="/"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
                Back to Home
            </a>
        </div>
    );
}
