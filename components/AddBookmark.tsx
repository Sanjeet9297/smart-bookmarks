'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Link as LinkIcon, Type } from 'lucide-react';

export default function AddBookmark({ userId }: { userId: string }) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !title) return;

        setLoading(true);
        const { error } = await supabase
            .from('bookmarks')
            .insert([{ url, title, user_id: userId }]);

        if (error) {
            alert(error.message);
        } else {
            setUrl('');
            setTitle('');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-2xl glass p-6 animate-in">
            <h2 className="text-xl font-semibold mb-2">Add New Bookmark</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Bookmark Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    />
                </div>
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? 'Adding...' : (
                        <>
                            <Plus className="h-4 w-4" /> Add
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
