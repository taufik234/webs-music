import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Music2, Trash2, Edit } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Playlist = Database["public"]["Tables"]["playlists"]["Row"];
type Song = Database["public"]["Tables"]["songs"]["Row"];
type PlaylistSong = Database["public"]["Tables"]["playlist_songs"]["Row"];

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddSongsOpen, setIsAddSongsOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  useEffect(() => {
    if (selectedPlaylist) {
      fetchPlaylistSongs(selectedPlaylist.id);
    }
  }, [selectedPlaylist]);

  const checkAuthAndFetchData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    await Promise.all([fetchPlaylists(), fetchAllSongs()]);
  };

  const fetchPlaylists = async () => {
    const { data, error } = await supabase.from("playlists").select("*").order("updated_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPlaylists(data || []);
    }
  };

  const fetchAllSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*").order("title");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAllSongs(data || []);
    }
  };

  const fetchPlaylistSongs = async (playlistId: string) => {
    const { data, error } = await supabase.from("playlist_songs").select("song_id").eq("playlist_id", playlistId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    const songIds = data.map((ps) => ps.song_id);
    const { data: songs, error: songsError } = await supabase.from("songs").select("*").in("id", songIds);

    if (songsError) {
      toast({ title: "Error", description: songsError.message, variant: "destructive" });
    } else {
      setPlaylistSongs(songs || []);
    }
  };

  const createPlaylist = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("playlists").insert({
      user_id: session.user.id,
      name: newPlaylistName,
      description: newPlaylistDesc,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Playlist created!" });
      setNewPlaylistName("");
      setNewPlaylistDesc("");
      setIsCreateOpen(false);
      fetchPlaylists();
    }
  };

  const deletePlaylist = async (id: string) => {
    const { error } = await supabase.from("playlists").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Playlist deleted!" });
      if (selectedPlaylist?.id === id) {
        setSelectedPlaylist(null);
      }
      fetchPlaylists();
    }
  };

  const addSongToPlaylist = async (songId: string) => {
    if (!selectedPlaylist) return;

    const { error } = await supabase.from("playlist_songs").insert({
      playlist_id: selectedPlaylist.id,
      song_id: songId,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Info", description: "Song already in playlist" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Success", description: "Song added to playlist!" });
      fetchPlaylistSongs(selectedPlaylist.id);
    }
  };

  const removeSongFromPlaylist = async (songId: string) => {
    if (!selectedPlaylist) return;

    const { error } = await supabase.from("playlist_songs").delete().eq("playlist_id", selectedPlaylist.id).eq("song_id", songId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Song removed from playlist!" });
      fetchPlaylistSongs(selectedPlaylist.id);
    }
  };

  const playSong = (song: Song, index: number) => {
    setCurrentSong(song);
    setCurrentIndex(index);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % playlistSongs.length;
    setCurrentSong(playlistSongs[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const playPrevious = () => {
    const prevIndex = currentIndex === 0 ? playlistSongs.length - 1 : currentIndex - 1;
    setCurrentSong(playlistSongs[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />

      <main className="container mx-auto px-4 pt-24">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">My Playlists</h1>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Playlist Name</Label>
                  <Input id="name" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="My Awesome Playlist" className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" value={newPlaylistDesc} onChange={(e) => setNewPlaylistDesc(e.target.value)} placeholder="Describe your playlist..." className="bg-muted/50 border-border" />
                </div>
                <Button onClick={createPlaylist} className="w-full bg-gradient-primary hover:opacity-90" disabled={!newPlaylistName}>
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Playlists List */}
          <div className="md:col-span-1 space-y-4">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className={`p-4 cursor-pointer transition-all ${selectedPlaylist?.id === playlist.id ? "bg-primary/20 border-primary" : "bg-card/50 hover:bg-card border-border"}`}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{playlist.name}</h3>
                    {playlist.description && <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}

            {playlists.length === 0 && (
              <div className="text-center py-12">
                <Music2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No playlists yet. Create one!</p>
              </div>
            )}
          </div>

          {/* Playlist Songs */}
          <div className="md:col-span-2">
            {selectedPlaylist ? (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPlaylist.name}</h2>
                    <p className="text-muted-foreground">{playlistSongs.length} songs</p>
                  </div>

                  <Dialog open={isAddSongsOpen} onOpenChange={setIsAddSongsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-border">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Songs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Songs to Playlist</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-2">
                        {allSongs.map((song) => (
                          <div key={song.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <img src={song.cover_url || "/placeholder.svg"} alt={song.title} className="w-12 h-12 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{song.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                            </div>
                            <Button size="sm" onClick={() => addSongToPlaylist(song.id)} className="bg-gradient-primary hover:opacity-90">
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  {playlistSongs.map((song, index) => (
                    <Card key={song.id} className="p-4 bg-card/50 hover:bg-card transition-all cursor-pointer group" onClick={() => playSong(song, index)}>
                      <div className="flex items-center gap-3">
                        <img src={song.cover_url || "/placeholder.svg"} alt={song.title} className="w-14 h-14 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{song.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSongFromPlaylist(song.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}

                  {playlistSongs.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No songs in this playlist yet.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Select a playlist to view songs</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <MusicPlayer currentSong={currentSong} playlist={playlistSongs} onNext={playNext} onPrevious={playPrevious} />
    </div>
  );
};

export default Playlists;
