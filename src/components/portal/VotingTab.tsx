import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  BarChart3,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  Plus,
  SendHorizontal,
  Trash2,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Poll = {
  id: string;
  title: string;
  description: string | null;
  options: string[];
  status: string;
  created_by: string;
  deadline: string | null;
  created_at: string;
};

type PollVote = {
  id: string;
  poll_id: string;
  user_id: string;
  selected_option: number;
  created_at: string;
};

type PollComment = {
  id: string;
  poll_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

interface VotingTabProps {
  userId: string;
  profileNameByUserId: Map<string, string>;
  isMasterAdmin: boolean;
}

const VotingTab = ({ userId, profileNameByUserId, isMasterAdmin }: VotingTabProps) => {
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [votes, setVotes] = useState<PollVote[]>([]);
  const [comments, setComments] = useState<PollComment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [newDeadline, setNewDeadline] = useState("");
  const [creating, setCreating] = useState(false);

  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [votingFor, setVotingFor] = useState<string | null>(null);

  const [showHistory, setShowHistory] = useState(false);

  const getDisplayName = (uid: string) => {
    if (uid === userId) return "Ti";
    return profileNameByUserId.get(uid) ?? "Član portala";
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [pollsRes, votesRes, commentsRes] = await Promise.all([
        supabase.from("polls" as never).select("*").order("created_at", { ascending: false }),
        supabase.from("poll_votes" as never).select("*"),
        supabase.from("poll_comments" as never).select("*").order("created_at", { ascending: true }),
      ]);

      if (pollsRes.error) throw pollsRes.error;
      if (votesRes.error) throw votesRes.error;

      setPolls((pollsRes.data ?? []) as unknown as Poll[]);
      setVotes((votesRes.data ?? []) as unknown as PollVote[]);
      setComments((commentsRes.data ?? []) as unknown as PollComment[]);
    } catch (error) {
      toast({ title: "Greška pri učitavanju glasanja", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const activePolls = useMemo(() => polls.filter((p) => p.status === "active"), [polls]);
  const closedPolls = useMemo(() => polls.filter((p) => p.status === "closed"), [polls]);

  const votesByPoll = useMemo(() => {
    const map = new Map<string, PollVote[]>();
    votes.forEach((v) => {
      const arr = map.get(v.poll_id) ?? [];
      map.set(v.poll_id, [...arr, v]);
    });
    return map;
  }, [votes]);

  const commentsByPoll = useMemo(() => {
    const map = new Map<string, PollComment[]>();
    comments.forEach((c) => {
      const arr = map.get(c.poll_id) ?? [];
      map.set(c.poll_id, [...arr, c]);
    });
    return map;
  }, [comments]);

  const handleCreatePoll = async () => {
    const filteredOptions = newOptions.filter((o) => o.trim().length > 0);
    if (!newTitle.trim() || filteredOptions.length < 2) {
      toast({ title: "Unesite naslov i barem 2 opcije", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase.from("polls" as never).insert({
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        options: JSON.stringify(filteredOptions),
        created_by: userId,
        deadline: newDeadline || null,
        status: "active",
      } as never);

      if (error) throw error;

      setNewTitle("");
      setNewDescription("");
      setNewOptions(["", ""]);
      setNewDeadline("");
      setShowCreate(false);
      await loadData();
      toast({ title: "Glasanje je kreirano" });
    } catch (error) {
      toast({
        title: "Kreiranje glasanja nije uspjelo",
        description: error instanceof Error ? error.message : "",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    setVotingFor(pollId);
    try {
      const { error } = await supabase.from("poll_votes" as never).insert({
        poll_id: pollId,
        user_id: userId,
        selected_option: optionIndex,
      } as never);

      if (error) throw error;
      await loadData();
    } catch (error) {
      toast({
        title: "Glasanje nije uspjelo",
        description: error instanceof Error ? error.message : "",
        variant: "destructive",
      });
    } finally {
      setVotingFor(null);
    }
  };

  const handleClosePoll = async (pollId: string) => {
    const { error } = await supabase
      .from("polls" as never)
      .update({ status: "closed" } as never)
      .eq("id", pollId);

    if (error) {
      toast({ title: "Zatvaranje glasanja nije uspjelo", variant: "destructive" });
    } else {
      await loadData();
      toast({ title: "Glasanje je zatvoreno" });
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    const { error } = await supabase.from("polls" as never).delete().eq("id", pollId);
    if (error) {
      toast({ title: "Brisanje glasanja nije uspjelo", variant: "destructive" });
    } else {
      await loadData();
      toast({ title: "Glasanje je obrisano" });
    }
  };

  const handleSubmitComment = async (pollId: string) => {
    const body = commentDrafts[pollId]?.trim();
    if (!body) return;

    setSubmittingComment(pollId);
    try {
      const { error } = await supabase.from("poll_comments" as never).insert({
        poll_id: pollId,
        author_id: userId,
        body,
      } as never);
      if (error) throw error;

      setCommentDrafts((prev) => ({ ...prev, [pollId]: "" }));
      await loadData();
    } catch (error) {
      toast({ title: "Komentar nije spremljen", variant: "destructive" });
    } finally {
      setSubmittingComment(null);
    }
  };

  const renderPoll = (poll: Poll) => {
    const pollVotes = votesByPoll.get(poll.id) ?? [];
    const pollComments = commentsByPoll.get(poll.id) ?? [];
    const userVote = pollVotes.find((v) => v.user_id === userId);
    const totalVotes = pollVotes.length;
    const options: string[] = typeof poll.options === "string" ? JSON.parse(poll.options) : poll.options;
    const isActive = poll.status === "active";
    const isExpired = poll.deadline ? new Date(poll.deadline) < new Date() : false;
    const canVote = isActive && !isExpired && !userVote;

    return (
      <Card key={poll.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base">{poll.title}</CardTitle>
                <Badge variant={isActive && !isExpired ? "default" : "secondary"}>
                  {isActive && !isExpired ? "Aktivno" : isExpired ? "Isteklo" : "Zatvoreno"}
                </Badge>
              </div>
              {poll.description && (
                <CardDescription>{poll.description}</CardDescription>
              )}
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                <span>Kreirao: {getDisplayName(poll.created_by)}</span>
                <span>·</span>
                <span>{format(new Date(poll.created_at), "dd.MM.yyyy HH:mm")}</span>
                {poll.deadline && (
                  <>
                    <span>·</span>
                    <span>Rok: {format(new Date(poll.deadline), "dd.MM.yyyy HH:mm")}</span>
                  </>
                )}
                <span>·</span>
                <span>{totalVotes} glasova</span>
              </div>
            </div>
            {(isMasterAdmin || poll.created_by === userId) && (
              <div className="flex gap-1">
                {isActive && (
                  <Button variant="outline" size="sm" onClick={() => handleClosePoll(poll.id)}>
                    Zatvori
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeletePoll(poll.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options with voting / results */}
          <div className="space-y-2">
            {options.map((option, idx) => {
              const optionVotes = pollVotes.filter((v) => v.selected_option === idx).length;
              const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
              const isUserChoice = userVote?.selected_option === idx;

              return (
                <div key={idx} className="space-y-1">
                  {canVote ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2"
                      disabled={votingFor === poll.id}
                      onClick={() => handleVote(poll.id, idx)}
                    >
                      {votingFor === poll.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Vote className="mr-2 h-4 w-4 shrink-0" />
                      )}
                      {option}
                    </Button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isUserChoice ? "font-semibold text-primary" : ""}>
                          {isUserChoice && <CheckCircle2 className="inline mr-1 h-3.5 w-3.5" />}
                          {option}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {optionVotes} ({percentage}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Comments section */}
          <div className="space-y-2 border-t border-border pt-3">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <MessageSquareText className="h-3.5 w-3.5" />
              Rasprava ({pollComments.length})
            </p>

            {pollComments.map((comment) => (
              <div key={comment.id} className="rounded-md bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {getDisplayName(comment.author_id)}
                  </span>
                  <span>·</span>
                  <span>{format(new Date(comment.created_at), "dd.MM.yyyy HH:mm")}</span>
                </div>
                <p className="mt-1 text-sm">{comment.body}</p>
              </div>
            ))}

            <div className="flex gap-2">
              <Input
                placeholder="Napiši komentar..."
                className="h-8 text-sm"
                value={commentDrafts[poll.id] ?? ""}
                onChange={(e) =>
                  setCommentDrafts((prev) => ({ ...prev, [poll.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSubmitComment(poll.id);
                  }
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                disabled={!commentDrafts[poll.id]?.trim() || submittingComment === poll.id}
                onClick={() => handleSubmitComment(poll.id)}
              >
                {submittingComment === poll.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Učitavam glasanja...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5" />
                Online glasanje
              </CardTitle>
              <CardDescription>
                Kreirajte glasanja za odluke, glasajte i pratite rezultate u stvarnom vremenu.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
                <BarChart3 className="h-4 w-4" />
                {showHistory ? "Aktivna" : "Povijest"}
              </Button>
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" />
                Novo glasanje
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active / History polls */}
      {!showHistory && activePolls.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Nema aktivnih glasanja. Kreirajte novo glasanje.
          </CardContent>
        </Card>
      )}

      {!showHistory && activePolls.map(renderPoll)}

      {showHistory && closedPolls.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Nema završenih glasanja.
          </CardContent>
        </Card>
      )}

      {showHistory && closedPolls.map(renderPoll)}

      {/* Create Poll Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo glasanje</DialogTitle>
            <DialogDescription>Kreirajte glasanje za donošenje odluke.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Pitanje / naslov</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="npr. Odabir lokacije za godišnji event"
              />
            </div>
            <div className="grid gap-2">
              <Label>Opis (opcionalno)</Label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
                placeholder="Dodatni kontekst za glasanje..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Opcije za glasanje</Label>
              {newOptions.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[idx] = e.target.value;
                      setNewOptions(updated);
                    }}
                    placeholder={`Opcija ${idx + 1}`}
                  />
                  {newOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => setNewOptions(newOptions.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewOptions([...newOptions, ""])}
              >
                <Plus className="h-4 w-4" />
                Dodaj opciju
              </Button>
            </div>
            <div className="grid gap-2">
              <Label>Rok za glasanje (opcionalno)</Label>
              <Input
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Odustani
              </Button>
              <Button onClick={() => void handleCreatePoll()} disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Vote className="h-4 w-4" />}
                {creating ? "Kreiram..." : "Kreiraj glasanje"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VotingTab;
