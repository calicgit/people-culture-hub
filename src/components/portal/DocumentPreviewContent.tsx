import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

interface DocumentPreviewContentProps {
  source: string | null;
  fileName: string;
}

const detectPreviewKind = (source: string | null, fileName: string) => {
  if (!source) return "unsupported";
  if (source.startsWith("data:application/pdf") || fileName.toLowerCase().endsWith(".pdf")) return "pdf";
  if (source.startsWith("data:image/")) return "image";
  return "unsupported";
};

const PdfPreview = ({ source, fileName }: { source: string; fileName: string }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const renderPdf = async () => {
      setLoading(true);
      setError(null);
      setPages([]);

      try {
        const pdf = await getDocument(source).promise;
        const renderedPages: string[] = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.4 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error("Canvas nije dostupan za pregled PDF-a.");
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          renderedPages.push(canvas.toDataURL("image/png"));
        }

        if (!active) return;
        setPages(renderedPages);
      } catch (previewError) {
        if (!active) return;
        setError(previewError instanceof Error ? previewError.message : "PDF nije moguće prikazati.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void renderPdf();

    return () => {
      active = false;
    };
  }, [source]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Pripremam PDF pregled...
      </div>
    );
  }

  if (error) {
    return <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">{error}</div>;
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {pages.map((page, index) => (
          <div key={`${fileName}-page-${index + 1}`} className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <img
              src={page}
              alt={`Stranica ${index + 1} dokumenta ${fileName}`}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ImagePreview = ({ source, fileName }: { source: string; fileName: string }) => (
  <div className="flex h-full items-center justify-center overflow-auto p-4 sm:p-6">
    <img src={source} alt={fileName} className="max-h-full max-w-full rounded-lg border border-border bg-background shadow-sm" loading="lazy" />
  </div>
);

const UnsupportedPreview = () => (
  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
    Inline pregled je trenutno dostupan za PDF i slike. Za ovu datoteku koristi preuzimanje.
  </div>
);

const DocumentPreviewContent = ({ source, fileName }: DocumentPreviewContentProps) => {
  const previewKind = useMemo(() => detectPreviewKind(source, fileName), [source, fileName]);

  if (!source) return <UnsupportedPreview />;
  if (previewKind === "pdf") return <PdfPreview source={source} fileName={fileName} />;
  if (previewKind === "image") return <ImagePreview source={source} fileName={fileName} />;
  return <UnsupportedPreview />;
};

export default DocumentPreviewContent;