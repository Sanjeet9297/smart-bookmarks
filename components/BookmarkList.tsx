'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, ExternalLink } from 'lucide-react';

interface Bookmark {
    id: string;
    url: string;
    title: string;
    user_id: string;
    created_at: string;
}

export default function BookmarkList({ userId }: { userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial bookmarks
        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching bookmarks:', error);
            } else {
                setBookmarks(data || []);
            }
            setLoading(false);
        };

        fetchBookmarks();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id);
        if (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-secondary h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-secondary rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-secondary rounded col-span-2"></div>
                                <div className="h-2 bg-secondary rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-secondary rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.length === 0 ? (
                <div className="col-span-full py-20 text-center glass rounded-2xl">
                    <p className="text-muted-foreground">No bookmarks yet. Add one above! 🚀</p>
                </div>
            ) : (
                bookmarks.map((bookmark) => (
                    <div
                        key={bookmark.id}
                        className="group relative glass p-6 rounded-2xl border border-border hover:border-primary/50 transition-all hover:translate-y-[-4px] animate-in"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg line-clamp-1">{bookmark.title}</h3>
                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors duration-200"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-6">{bookmark.url}</p>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                            Visit <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                ))
            )}
        </div>
    );
}
