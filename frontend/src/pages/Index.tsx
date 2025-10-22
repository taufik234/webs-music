import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Play, Plus } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Song = Database["public"]["Tables"]["songs"]["Row"];

const Index = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchSongs();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.artist.toLowerCase().includes(searchQuery.toLowerCase()) || song.genre.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(songs);
    }
  }, [searchQuery, songs]);

  const checkAuthAndFetchSongs = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSongs(data || []);
      setFilteredSongs(data || []);
    }
    setLoading(false);
  };

  const playSong = (song: Song, index: number) => {
    setCurrentSong(song);
    setCurrentIndex(index);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    setCurrentSong(filteredSongs[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const playPrevious = () => {
    const prevIndex = currentIndex === 0 ? filteredSongs.length - 1 : currentIndex - 1;
    setCurrentSong(filteredSongs[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />

      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">Your Music, Your Vibe</h1>
          <p className="text-xl text-muted-foreground animate-fade-in">Discover and enjoy your favorite tracks</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="text" placeholder="Search songs, artists, or genres..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-14 bg-card/50 backdrop-blur-sm border-border text-lg" />
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSongs.map((song, index) => (
            <Card key={song.id} className="group bg-card/50 backdrop-blur-sm border-border hover:bg-card hover:shadow-card transition-all duration-300 overflow-hidden cursor-pointer animate-scale-in" onClick={() => playSong(song, index)}>
              <div className="relative aspect-square">
                <img src={song.cover_url || "/placeholder.svg"} alt={song.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 rounded-full w-16 h-16">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate mb-1">{song.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{song.genre}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/playlists");
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No songs found matching your search.</p>
          </div>
        )}
      </main>

      <MusicPlayer currentSong={currentSong} playlist={filteredSongs} onNext={playNext} onPrevious={playPrevious} />
    </div>
  );
};

export default Index;
