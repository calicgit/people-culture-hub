import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  Download,
  FileText,
  Loader2,
  LogOut,
  Plus,
  Shield,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Enums, Tables } from "@/integrations/supabase/types";

type DocumentRecord = {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  uploaded_by: string;
  visibility_body: Enums<"association_body"> | null;
  created_at: string;
  updated_at: string;
};

type CalendarEventRecord = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  location: string | null;
  created_by: string;
  visibility_body: Enums<"association_body"> | null;
  created_at: string;
  updated_at: string;
};

type DirectoryRole = Tables<"user_roles">;
type DirectoryProfile = Tables<"profiles">;
type DirectoryMembership = Tables<"user_body_memberships">;

const allMembersValue = "all-members";

const bodyOptions: { value: Enums<"association_body">; label: string }[] = [
  { value: "association_member", label: "Član Udruge" },
  { value: "upravno_vijece", label: "Upravno vijeće" },
  { value: "savjetodavno_vijece", label: "Savjetodavno vijeće" },
  { value: "znanstveno_vijece", label: "Znanstveno vijeće" },
];

const roleLabels: Record<Enums<"app_role">, string> = {
  master_admin: "Master Admin",
  member: "Member",
};

const formatFileSize = (size: number | null) => {
  if (!size) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const PortalDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, memberships, isMasterAdmin, signOut } = useAuth();

  const [portalLoading, setPortalLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventRecord[]>([]);
  const [directoryProfiles, setDirectoryProfiles] = useState<DirectoryProfile[]>([]);
  const [directoryMemberships, setDirectoryMemberships] = useState<DirectoryMembership[]>([]);
  const [directoryRoles, setDirectoryRoles] = useState<DirectoryRole[]>([]);

  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentVisibility, setDocumentVisibility] = useState<string>(allMembersValue);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartsAt, setEventStartsAt] = useState("");
  const [eventEndsAt, setEventEndsAt] = useState("");
  const [eventVisibility, setEventVisibility] = useState<string>(allMembersValue);
  const [savingEvent, setSavingEvent] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminFullName, setAdminFullName] = useState("");
  const [adminTitle, setAdminTitle] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState<Enums<"app_role">>("member");
  const [adminMembershipStatus, setAdminMembershipStatus] = useState("active");
  const [adminBodies, setAdminBodies] = useState<Enums<"association_body">[]>([]);
  const [adminActive, setAdminActive] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);

  const loadPortalData = async () => {
    if (!user) return;

    setPortalLoading(true);

    try {
      const [documentsResult, eventsResult, profilesResult, membershipsResult, rolesResult] = await Promise.all([
        supabase.from("documents" as never).select("*").order("created_at", { ascending: false }),
        supabase.from("calendar_events" as never).select("*").order("starts_at", { ascending: true }),
        supabase.from("profiles").select("*").order("full_name", { ascending: true }),
        supabase.from("user_body_memberships").select("*").order("created_at", { ascending: true }),
        isMasterAdmin
          ? supabase.from("user_roles").select("*").order("created_at", { ascending: true })
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (documentsResult.error) throw documentsResult.error;
      if (eventsResult.error) throw eventsResult.error;
      if (profilesResult.error) throw profilesResult.error;
      if (membershipsResult.error) throw membershipsResult.error;
      if (rolesResult.error) throw rolesResult.error;

      setDocuments((documentsResult.data ?? []) as unknown as DocumentRecord[]);
      setCalendarEvents((eventsResult.data ?? []) as unknown as CalendarEventRecord[]);
      setDirectoryProfiles(profilesResult.data ?? []);
      setDirectoryMemberships(membershipsResult.data ?? []);
      setDirectoryRoles((rolesResult.data ?? []) as DirectoryRole[]);
    } catch (error) {
      const description = error instanceof Error ? error.message : "Pokušaj ponovno.";
      toast({ title: "Greška pri učitavanju portala", description, variant: "destructive" });
    } finally {
      setPortalLoading(false);
    }
  };

  useEffect(() => {
    void loadPortalData();
  }, [user?.id, isMasterAdmin]);

  const directoryRows = useMemo(() => {
    const membershipMap = new Map<string, Enums<"association_body">[]>();
    const roleMap = new Map<string, Enums<"app_role">[]>();

    directoryMemberships.forEach((membership) => {
      const current = membershipMap.get(membership.user_id) ?? [];
      membershipMap.set(membership.user_id, [...current, membership.body]);
    });

    directoryRoles.forEach((role) => {
      const current = roleMap.get(role.user_id) ?? [];
      roleMap.set(role.user_id, [...current, role.role]);
    });

    return directoryProfiles.map((item) => ({
      ...item,
      bodies: membershipMap.get(item.user_id) ?? [],
      roles: roleMap.get(item.user_id) ?? [],
    }));
  }, [directoryMemberships, directoryProfiles, directoryRoles]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return calendarEvents;

    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.starts_at);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
  }, [calendarEvents, selectedDate]);

  const memberSummary = useMemo(() => {
    const bodySet = new Set(memberships.map((membership) => membership.body));
    return bodyOptions.filter((option) => bodySet.has(option.value)).map((option) => option.label);
  }, [memberships]);

  const handleLogout = async () => {
    await signOut();
    navigate("/council-login", { replace: true });
  };

  const handleDocumentUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !documentFile) {
      toast({ title: "Odaberi dokument", description: "Potrebno je dodati datoteku za upload.", variant: "destructive" });
      return;
    }

    setUploadingDocument(true);

    const safeName = documentFile.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
    const filePath = `${user.id}/${Date.now()}-${safeName}`;
    const visibilityBody = documentVisibility === allMembersValue ? null : (documentVisibility as Enums<"association_body">);

    try {
      const uploadResult = await supabase.storage.from("dms-documents").upload(filePath, documentFile, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadResult.error) throw uploadResult.error;

      const insertResult = await supabase.from("documents" as never).insert({
        title: documentTitle.trim(),
        description: documentDescription.trim() || null,
        file_path: filePath,
        file_name: documentFile.name,
        file_size_bytes: documentFile.size,
        mime_type: documentFile.type || null,
        uploaded_by: user.id,
        visibility_body: visibilityBody,
      } as never);

      if (insertResult.error) {
        await supabase.storage.from("dms-documents").remove([filePath]);
        throw insertResult.error;
      }

      setDocumentTitle("");
      setDocumentDescription("");
      setDocumentVisibility(allMembersValue);
      setDocumentFile(null);
      event.currentTarget.reset();
      await loadPortalData();

      toast({ title: "Dokument je spremljen", description: "Dokument je dostupan kroz portal." });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Pokušaj ponovno.";
      toast({ title: "Upload nije uspio", description, variant: "destructive" });
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDownload = async (document: DocumentRecord) => {
    const { data, error } = await supabase.storage.from("dms-documents").createSignedUrl(document.file_path, 60);

    if (error || !data?.signedUrl) {
      toast({ title: "Preuzimanje nije uspjelo", description: error?.message ?? "Pokušaj ponovno.", variant: "destructive" });
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const handleDeleteDocument = async (documentId: string, filePath: string) => {
    const { error } = await supabase.from("documents" as never).delete().eq("id", documentId);

    if (error) {
      toast({ title: "Brisanje nije uspjelo", description: error.message, variant: "destructive" });
      return;
    }

    await supabase.storage.from("dms-documents").remove([filePath]);
    await loadPortalData();
    toast({ title: "Dokument je obrisan" });
  };

  const handleEventSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) return;

    setSavingEvent(true);

    try {
      const { error } = await supabase.from("calendar_events" as never).insert({
        title: eventTitle.trim(),
        description: eventDescription.trim() || null,
        location: eventLocation.trim() || null,
        starts_at: new Date(eventStartsAt).toISOString(),
        ends_at: new Date(eventEndsAt).toISOString(),
        created_by: user.id,
        visibility_body: eventVisibility === allMembersValue ? null : eventVisibility,
      } as never);

      if (error) throw error;

      setEventTitle("");
      setEventDescription("");
      setEventLocation("");
      setEventStartsAt("");
      setEventEndsAt("");
      setEventVisibility(allMembersValue);
      await loadPortalData();

      toast({ title: "Događaj je dodan", description: "Kalendar je ažuriran." });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Pokušaj ponovno.";
      toast({ title: "Spremanje događaja nije uspjelo", description, variant: "destructive" });
    } finally {
      setSavingEvent(false);
    }
  };

  const toggleAdminBody = (body: Enums<"association_body">, checked: boolean) => {
    setAdminBodies((current) =>
      checked ? Array.from(new Set([...current, body])) : current.filter((item) => item !== body),
    );
  };

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCreatingUser(true);

    try {
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: {
          email: adminEmail.trim(),
          password: adminPassword,
          fullName: adminFullName.trim(),
          title: adminTitle.trim() || null,
          membershipStatus: adminMembershipStatus,
          isActive: adminActive,
          role: adminRole,
          bodies: adminBodies,
        },
      });

      if (error) throw error;

      setAdminEmail("");
      setAdminFullName("");
      setAdminTitle("");
      setAdminPassword("");
      setAdminRole("member");
      setAdminMembershipStatus("active");
      setAdminBodies([]);
      setAdminActive(true);
      await loadPortalData();

      toast({
        title: "Korisnik je kreiran",
        description: data?.message ?? "Račun je spreman s privremenom lozinkom.",
      });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Pokušaj ponovno.";
      toast({ title: "Kreiranje korisnika nije uspjelo", description, variant: "destructive" });
    } finally {
      setCreatingUser(false);
    }
  };

  const overviewCards = [
    {
      title: "Dokumenti",
      value: documents.length,
      description: "aktivnih dokumenata u portalu",
      icon: FileText,
    },
    {
      title: "Kalendar",
      value: calendarEvents.length,
      description: "događaja i sastanaka",
      icon: CalendarDays,
    },
    {
      title: "Users & Access",
      value: directoryProfiles.length,
      description: "aktivnih članova i profila",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">DMS portal</Badge>
              {isMasterAdmin && <Badge>Master Admin</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-foreground">Interni portal udruge</h1>
            <p className="text-sm text-muted-foreground">
              {profile?.full_name ?? user?.email} · {memberSummary.length > 0 ? memberSummary.join(", ") : "Pristup članskom portalu"}
            </p>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Odjava
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          {overviewCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardDescription>{card.title}</CardDescription>
                  <CardTitle className="text-3xl">{card.value}</CardTitle>
                </div>
                <div className="rounded-full border border-border bg-accent p-3 text-accent-foreground">
                  <card.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {portalLoading ? (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-16 text-muted-foreground">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-primary" />
            Učitavam dokumente, kalendar i članove...
          </div>
        ) : (
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
              <TabsTrigger value="documents">Dokumenti</TabsTrigger>
              <TabsTrigger value="calendar">Kalendar</TabsTrigger>
              <TabsTrigger value="members">Users & Access</TabsTrigger>
              {isMasterAdmin && <TabsTrigger value="admin">Master Admin</TabsTrigger>}
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Dokumenti i razmjena datoteka</CardTitle>
                    <CardDescription>Upload, pregled i kontrola pristupa po vijećima.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleDocumentUpload} className="grid gap-4 rounded-xl border border-border bg-accent/40 p-4">
                      <div className="grid gap-2">
                        <Label htmlFor="document-title">Naziv dokumenta</Label>
                        <Input id="document-title" value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="document-description">Opis</Label>
                        <Textarea
                          id="document-description"
                          value={documentDescription}
                          onChange={(e) => setDocumentDescription(e.target.value)}
                          placeholder="Kratki opis dokumenta, verzije ili namjene..."
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Vidljivost</Label>
                          <Select value={documentVisibility} onValueChange={setDocumentVisibility}>
                            <SelectTrigger>
                              <SelectValue placeholder="Odaberi vidljivost" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={allMembersValue}>Svi prijavljeni članovi</SelectItem>
                              {bodyOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="document-file">Datoteka</Label>
                          <Input
                            id="document-file"
                            type="file"
                            onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={uploadingDocument}>
                        {uploadingDocument ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingDocument ? "Spremam dokument..." : "Dodaj dokument"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popis dokumenata</CardTitle>
                    <CardDescription>Vidite samo dokumente na koje imate pravo pristupa.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {documents.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                        Još nema dokumenata u portalu.
                      </div>
                    ) : (
                      documents.map((document) => (
                        <div key={document.id} className="rounded-xl border border-border p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-foreground">{document.title}</h3>
                                <Badge variant="outline">
                                  {bodyOptions.find((option) => option.value === document.visibility_body)?.label ?? "Svi članovi"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{document.description || "Bez dodatnog opisa."}</p>
                              <p className="text-xs text-muted-foreground">
                                {document.file_name} · {formatFileSize(document.file_size_bytes)} · {format(new Date(document.created_at), "dd.MM.yyyy. HH:mm")}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleDownload(document)}>
                                <Download className="h-4 w-4" />
                                Preuzmi
                              </Button>
                              {(isMasterAdmin || document.uploaded_by === user?.id) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => void handleDeleteDocument(document.id, document.file_path)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Kalendar sastanaka</CardTitle>
                    <CardDescription>Zajednički raspored sastanaka, sjednica i radionica.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border border-border">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="w-full" />
                    </div>
                    <form onSubmit={handleEventSubmit} className="grid gap-4 rounded-xl border border-border bg-accent/40 p-4">
                      <div className="grid gap-2">
                        <Label htmlFor="event-title">Naslov događaja</Label>
                        <Input id="event-title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="event-description">Opis</Label>
                        <Textarea id="event-description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="event-start">Početak</Label>
                          <Input id="event-start" type="datetime-local" value={eventStartsAt} onChange={(e) => setEventStartsAt(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="event-end">Završetak</Label>
                          <Input id="event-end" type="datetime-local" value={eventEndsAt} onChange={(e) => setEventEndsAt(e.target.value)} required />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="event-location">Lokacija</Label>
                          <Input id="event-location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Online / ured / dvorana" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Vidljivost</Label>
                          <Select value={eventVisibility} onValueChange={setEventVisibility}>
                            <SelectTrigger>
                              <SelectValue placeholder="Odaberi vidljivost" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={allMembersValue}>Svi prijavljeni članovi</SelectItem>
                              {bodyOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" disabled={savingEvent}>
                        {savingEvent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        {savingEvent ? "Spremam događaj..." : "Dodaj događaj"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Događaji za odabrani datum</CardTitle>
                    <CardDescription>
                      {selectedDate ? format(selectedDate, "dd.MM.yyyy.") : "Prikaz svih događaja"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedDayEvents.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                        Nema događaja za odabrani datum.
                      </div>
                    ) : (
                      selectedDayEvents.map((item) => (
                        <div key={item.id} className="rounded-xl border border-border p-4">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <Badge variant="outline">
                              {bodyOptions.find((option) => option.value === item.visibility_body)?.label ?? "Svi članovi"}
                            </Badge>
                          </div>
                          {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              {format(new Date(item.starts_at), "dd.MM.yyyy. HH:mm")} — {format(new Date(item.ends_at), "dd.MM.yyyy. HH:mm")}
                            </p>
                            {item.location && <p>Lokacija: {item.location}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Users & Access</CardTitle>
                  <CardDescription>Pregled članova udruge, vijeća i pristupnih razina.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ime i prezime</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Funkcija</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Vijeća / članstvo</TableHead>
                        {isMasterAdmin && <TableHead>Uloga</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {directoryRows.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium text-foreground">{member.full_name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.title ?? "—"}</TableCell>
                          <TableCell>
                            <Badge variant={member.is_active ? "secondary" : "outline"}>{member.membership_status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {member.bodies.length > 0 ? (
                                member.bodies.map((body) => (
                                  <Badge key={body} variant="outline">
                                    {bodyOptions.find((option) => option.value === body)?.label ?? body}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          {isMasterAdmin && (
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {member.roles.length > 0 ? (
                                  member.roles.map((role) => <Badge key={role}>{roleLabels[role]}</Badge>)
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {isMasterAdmin && (
              <TabsContent value="admin" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <Card>
                    <CardHeader>
                      <CardTitle>Master Admin · Kreiranje korisnika</CardTitle>
                      <CardDescription>Kreiraj profil, dodijeli vijeće i pošalji privremenu lozinku.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateUser} className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="admin-full-name">Ime i prezime</Label>
                            <Input id="admin-full-name" value={adminFullName} onChange={(e) => setAdminFullName(e.target.value)} required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="admin-email">Email</Label>
                            <Input id="admin-email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="admin-title">Funkcija</Label>
                            <Input id="admin-title" value={adminTitle} onChange={(e) => setAdminTitle(e.target.value)} placeholder="npr. član vijeća / predsjednik" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="admin-password">Privremena lozinka</Label>
                            <Input id="admin-password" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} minLength={8} required />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid gap-2">
                            <Label>Uloga</Label>
                            <Select value={adminRole} onValueChange={(value) => setAdminRole(value as Enums<"app_role">)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="master_admin">Master Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>Status članstva</Label>
                            <Select value={adminMembershipStatus} onValueChange={setAdminMembershipStatus}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">active</SelectItem>
                                <SelectItem value="inactive">inactive</SelectItem>
                                <SelectItem value="pending">pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label>Dodjela vijeća i članstva</Label>
                          <div className="grid gap-3 rounded-xl border border-border bg-accent/40 p-4 md:grid-cols-2">
                            {bodyOptions.map((option) => (
                              <label key={option.value} className="flex items-center gap-3 text-sm text-foreground">
                                <Checkbox
                                  checked={adminBodies.includes(option.value)}
                                  onCheckedChange={(checked) => toggleAdminBody(option.value, checked === true)}
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-center gap-3 text-sm text-foreground">
                          <Checkbox checked={adminActive} onCheckedChange={(checked) => setAdminActive(checked === true)} />
                          Profil je odmah aktivan
                        </label>

                        <Button type="submit" disabled={creatingUser}>
                          {creatingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                          {creatingUser ? "Kreiram korisnika..." : "Kreiraj korisnika"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Kako ovo radi</CardTitle>
                      <CardDescription>Brzi pregled Master Admin procesa.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                      <div className="rounded-xl border border-border p-4">
                        <p className="font-medium text-foreground mb-1">1. Kreiraš korisnika</p>
                        <p>Unosiš email, privremenu lozinku, vijeće i status članstva.</p>
                      </div>
                      <div className="rounded-xl border border-border p-4">
                        <p className="font-medium text-foreground mb-1">2. Sustav dodjeljuje pristup</p>
                        <p>Profil, uloga i Users & Access zapisi kreiraju se u jednom koraku.</p>
                      </div>
                      <div className="rounded-xl border border-border p-4">
                        <p className="font-medium text-foreground mb-1">3. Korisnik ulazi u portal</p>
                        <p>Prijava se vrši emailom i privremenom lozinkom, a pristup dokumentima ovisi o vijeću.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default PortalDashboard;