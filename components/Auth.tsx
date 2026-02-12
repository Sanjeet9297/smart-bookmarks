'use client';

import { supabase } from '@/lib/supabase';
import { LogIn } from 'lucide-react';
import Image from 'next/image';

export default function Auth() {
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: "http://localhost:3000/auth/callback",
            },
        });

        if (error) {
            console.error('Login error:', error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in text-center">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    Smart Bookmarks
                </h1>
                <p className="text-muted-foreground text-lg max-w-[500px]">
                    Organize your digital life with real-time syncing across all your devices.
                </p>
            </div>

            <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-zinc-100 transition-all border border-zinc-200 shadow-xl"
            >
                <Image src="/google.svg" alt="Google" width={20} height={20} />
                Sign in with Google
            </button>
        </div>
    );
}
