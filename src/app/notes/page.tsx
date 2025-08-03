// src/app/notes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import ProtectedRoute from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Note, getNotes, addNote, updateNote, deleteNote } from '@/services/noteService';
import { summarizeNote } from '@/ai/flows/summarize-notes';
import { Plus, Trash2, Edit, Sparkles, Loader2, BotMessageSquare, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NotesPage() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [noteContent, setNoteContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);

    const fetchNotes = async () => {
        if(user) {
            setLoading(true);
            const userNotes = await getNotes(user.uid);
            setNotes(userNotes);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotes();
    }, [user]);

    useEffect(() => {
        if(selectedNote) {
            setNoteTitle(selectedNote.title);
            setNoteContent(selectedNote.content);
        } else {
            setNoteTitle('');
            setNoteContent('');
        }
    }, [selectedNote]);
    
    const handleSelectNote = (note: Note) => {
        if(selectedNote?.id === note.id) {
            setSelectedNote(null);
        } else {
            setSelectedNote(note);
        }
    };

    const handleNewNote = () => {
        setSelectedNote(null);
        setNoteTitle('New Note');
        setNoteContent('');
    };

    const handleSaveNote = async () => {
        if(!user || !noteTitle.trim()) return;
        setIsSaving(true);
        if(selectedNote) {
            await updateNote(selectedNote.id, { title: noteTitle, content: noteContent });
        } else {
            const newNote: Omit<Note, 'id' | 'createdAt'> = {
                title: noteTitle,
                content: noteContent,
                userId: user.uid,
            };
            await addNote(newNote);
        }
        await fetchNotes();
        setIsSaving(false);
        // After saving, find and select the note that was just saved/created
        const latestNote = notes.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds)[0];
        if(!selectedNote && latestNote) setSelectedNote(latestNote);
    };

    const handleDeleteNote = async (noteId: string) => {
        await deleteNote(noteId);
        setSelectedNote(null);
        await fetchNotes();
    };

    const handleSummarize = async () => {
        if(!noteContent) return;
        setIsSummarizing(true);
        setSummary('');
        setIsSummaryDialogOpen(true);
        try {
            const result = await summarizeNote({ content: noteContent });
            setSummary(result.summary);
        } catch (error) {
            setSummary("Sorry, I couldn't summarize this note. Please try again.");
            console.error(error);
        } finally {
            setIsSummarizing(false);
        }
    }

    return (
        <ProtectedRoute>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
                {/* Notes List */}
                <Card className="lg:col-span-1 h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>My Notes</CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleNewNote}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                        <ScrollArea className="h-full">
                        {loading ? (
                            <div className="p-6 space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : notes.length > 0 ? (
                           <ul className="divide-y">
                                {notes.map(note => (
                                    <li key={note.id}>
                                        <button 
                                            onClick={() => handleSelectNote(note)} 
                                            className={`w-full text-left p-4 hover:bg-muted/50 ${selectedNote?.id === note.id ? 'bg-muted' : ''}`}
                                        >
                                            <h3 className="font-semibold">{note.title}</h3>
                                            <p className="text-sm text-muted-foreground truncate">{note.content.substring(0, 50) || 'No content'}</p>
                                        </button>
                                    </li>
                                ))}
                           </ul>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">You have no notes yet.</p>
                                <Button variant="link" onClick={handleNewNote}>Create one now</Button>
                            </div>
                        )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Note Editor */}
                <div className="lg:col-span-2 h-full flex flex-col">
                    <Card className="flex-grow flex flex-col">
                        {selectedNote || noteTitle === 'New Note' ? (
                            <>
                                <CardHeader>
                                    <Input 
                                        value={noteTitle}
                                        onChange={e => setNoteTitle(e.target.value)}
                                        className="text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0"
                                        placeholder="Note Title"
                                    />
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <Textarea
                                        placeholder="Start writing your note here..."
                                        className="flex-grow w-full h-full resize-none border-none p-0 focus-visible:ring-0"
                                        value={noteContent}
                                        onChange={e => setNoteContent(e.target.value)}
                                    />
                                </CardContent>
                                <div className="flex items-center justify-end p-4 border-t gap-2">
                                    {selectedNote && (
                                    <Button variant="destructive" size="icon" onClick={() => handleDeleteNote(selectedNote.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    )}
                                    <Button variant="secondary" onClick={handleSummarize} disabled={!noteContent || isSummarizing}>
                                        {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Summarize
                                    </Button>
                                    <Button onClick={handleSaveNote} disabled={isSaving}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Note
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <NotebookText className="h-16 w-16 text-muted-foreground" />
                                <h2 className="mt-4 text-2xl font-semibold">Select a note to view or edit</h2>
                                <p className="mt-2 text-muted-foreground">Or create a new one to get started.</p>
                                <Button className="mt-4" onClick={handleNewNote}>
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Create New Note
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
             <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><BotMessageSquare /> AI Summary</DialogTitle>
                        <DialogDescription>
                           Here is a summary of your note, generated by AI.
                        </DialogDescription>
                    </DialogHeader>
                    {isSummarizing ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto">
                           {summary.includes("Sorry") ? (
                               <p className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" />{summary}</p>
                           ) : (
                                <p>{summary}</p>
                           )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </ProtectedRoute>
    );
}
