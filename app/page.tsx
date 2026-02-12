'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Auth from '@/components/Auth';
import AddBookmark from '@/components/AddBookmark';
import BookmarkList from '@/components/BookmarkList';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="space-y-10 animate-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
          <p className="text-muted-foreground mt-1">Manage your favorite links across the web.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 glass rounded-2xl border border-border/50">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium hidden sm:inline-block">
              {user.email}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-foreground"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-12">
        <AddBookmark userId={user.id} />

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Your Library</h2>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>
          <BookmarkList userId={user.id} />
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-20 pb-10 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Smart Bookmarks. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
