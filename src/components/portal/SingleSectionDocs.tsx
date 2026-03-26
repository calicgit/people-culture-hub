import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import {
  Download,
  Eye,
  FileText,
  Loader2,
  MessageSquareText,
  SendHorizontal,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SectionDocument = {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  uploaded_by: string;
  section: string | null;
  created_at: string;
};

type SectionComment = {
  id: string;
  document_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

interface SingleSectionDocsProps {
  sectionId: string;
  sectionLabel: string;
  userId: string;
  profileNameByUserId: Map<string, string>;
}

const formatFileSize = (size: number | null) => {
  if (!size) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const SingleSectionDocs = ({ sectionId, sectionLabel, userId, profileNameByUserId }: SingleSectionDocsProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<SectionDocument[]>([]);
  const [comments, setComments] = useState<SectionComment[]>([]);
  const [loading, setLoading] = useState(true);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [submittingCommentFor, setSubmittingCommentFor] = useState<string | null>(null);

  const getDisplayName = (uid: string) => {
    if (uid === userId) return "Ti";
    return profileNameByUserId.get(uid) ?? "Član portala";
  };

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data: docs, error: docsError } = await supabase
        .from("documents" as never)
        .select("*")
        .eq("section", sectionId)
        .order("created_at", { ascending: false });

      if (docsError) throw docsError;

      const typedDocs = (docs ?? []) as unknown as SectionDocument[];
      setDocuments(typedDocs);

      if (typedDocs.length > 0) {
        const docIds = typedDocs.map((d) => d.id);
        const { data: cmts, error: cmtsError } = await supabase
          .from("document_comments" as never)
          .select("*")
          .in("document_id", docIds)
          .order("created_at", { ascending: true });

        if (!cmtsError) {
          setComments((cmts ?? []) as unknown as SectionComment[]);
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      toast({
        title: "Greška pri učitavanju dokumenata",
        description: error instanceof Error ? error.message : "Pokušaj ponovno.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDocuments();
  }, [sectionId]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadFile) {
      toast({ title: "Odaberi datoteku", variant: "destructive" });
      return;
    }

    const formRef = e.currentTarget;
    setUploading(true);
    const safeName = uploadFile.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
    const filePath = `${userId}/sections/${sectionId}/${Date.now()}-${safeName}`;

    try {
      const uploadResult = await supabase.storage.from("dms-documents").upload(filePath, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadResult.error) throw uploadResult.error;

      const insertResult = await supabase
        .from("documents" as never)
        .insert({
          title: uploadTitle.trim(),
          description: uploadDescription.trim() || null,
          file_path: filePath,
          file_name: uploadFile.name,
          file_size_bytes: uploadFile.size,
          mime_type: uploadFile.type || null,
          uploaded_by: userId,
          visibility_body: null,
          section: sectionId,
        } as never)
        .select("id")
        .single();

      if (insertResult.error) {
        await supabase.storage.from("dms-documents").remove([filePath]);
        throw insertResult.error;
      }

      setUploadTitle("");
      setUploadDescription("");
      setUploadFile(null);
      formRef.reset();
      await loadDocuments();
      toast({ title: "Dokument je spremljen" });
    } catch (error) {
      toast({
        title: "Upload nije uspio",
        description: error instanceof Error ? error.message : "Pokušaj ponovno.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filePath: string) => {
    const { data, error } = await supabase.storage.from("dms-documents").createSignedUrl(filePath, 60);
    if (error || !data?.signedUrl) {
      toast({ title: "Preuzimanje nije uspjelo", variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (docId: string, filePath: string) => {
    const { error } = await supabase.from("documents" as never).delete().eq("id", docId);
    if (error) {
      toast({ title: "Brisanje nije uspjelo", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.storage.from("dms-documents").remove([filePath]);
    await loadDocuments();
    toast({ title: "Dokument je obrisan" });
  };

  const handleSubmitComment = async (documentId: string) => {
    const body = commentDrafts[documentId]?.trim();
    if (!body) return;

    setSubmittingCommentFor(documentId);
    try {
      const { error } = await supabase.from("document_comments" as never).insert({
        document_id: documentId,
        author_id: userId,
        body,
      } as never);
      if (error) throw error;

      setCommentDrafts((prev) => ({ ...prev, [documentId]: "" }));
      await loadDocuments();
    } catch (error) {
      toast({
        title: "Komentar nije spremljen",
        description: error instanceof Error ? error.message : "Pokušaj ponovno.",
        variant: "destructive",
      });
    } finally {
      setSubmittingCommentFor(null);
    }
  };

  const commentsByDocId = useMemo(() => {
    const map = new Map<string, SectionComment[]>();
    comments.forEach((c) => {
      const arr = map.get(c.document_id) ?? [];
      map.set(c.document_id, [...arr, c]);
    });
    return map;
  }, [comments]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {sectionLabel}
          </CardTitle>
          <CardDescription>Upload dokumenata, komentari i kolaboracija.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload form */}
          <form
            onSubmit={handleUpload}
            className="space-y-3 rounded-lg border border-dashed border-border bg-muted/20 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dodaj dokument
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Naziv</Label>
                <Input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Naziv dokumenta"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Datoteka</Label>
                <Input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Opis (opcionalno)</Label>
              <Textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                rows={2}
                placeholder="Kratki opis dokumenta..."
              />
            </div>
            <Button type="submit" size="sm" disabled={uploading}>
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </form>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Učitavam dokumente...
            </div>
          )}

          {/* Documents list */}
          {!loading && documents.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nema dokumenata u ovoj sekciji.
            </p>
          )}

          {documents.map((doc) => {
            const docComments = commentsByDocId.get(doc.id) ?? [];
            return (
              <div key={doc.id} className="rounded-lg border border-border bg-background p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="font-medium text-sm truncate">{doc.title}</span>
                    </div>
                    {doc.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{doc.description}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{doc.file_name}</span>
                      <span>·</span>
                      <span>{formatFileSize(doc.file_size_bytes)}</span>
                      <span>·</span>
                      <span>{getDisplayName(doc.uploaded_by)}</span>
                      <span>·</span>
                      <span>{format(new Date(doc.created_at), "dd.MM.yyyy HH:mm")}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(doc.file_path)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(doc.id, doc.file_path)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-2 border-t border-border pt-3">
                  <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <MessageSquareText className="h-3.5 w-3.5" />
                    Komentari ({docComments.length})
                  </p>

                  {docComments.map((comment) => (
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
                      value={commentDrafts[doc.id] ?? ""}
                      onChange={(e) =>
                        setCommentDrafts((prev) => ({ ...prev, [doc.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSubmitComment(doc.id);
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      disabled={!commentDrafts[doc.id]?.trim() || submittingCommentFor === doc.id}
                      onClick={() => handleSubmitComment(doc.id)}
                    >
                      {submittingCommentFor === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SendHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleSectionDocs;
