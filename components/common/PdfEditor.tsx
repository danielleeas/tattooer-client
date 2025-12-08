'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  useRef,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, PenSquare, Type, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

type Annotation =
  | {
    id: string;
    pageNumber: number;
    type: 'text';
    x: number;
    y: number;
    content: string;
    fontSize?: number;
  }
  | {
    id: string;
    pageNumber: number;
    type: 'signature';
    x: number;
    y: number;
    dataUrl: string;
    scale?: number;
  };

type Tool = 'none' | 'text' | 'signature';

interface PdfEditorProps {
  pdfUrl: string;
  /**
   * Called when the signed PDF has been generated and uploaded to Supabase.
   * Returns the Supabase public URL for the uploaded PDF.
   */
  onSignedPdfReady?: (args: { blob: Blob; objectUrl: string; supabaseUrl: string }) => void;
}

export default function PdfEditor({ pdfUrl, onSignedPdfReady }: PdfEditorProps) {
  const fileId = useId();
  const [file, setFile] = useState<PDFFile>(pdfUrl);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [activeTool, setActiveTool] = useState<Tool>('none');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [pendingSignaturePosition, setPendingSignaturePosition] = useState<{
    pageNumber: number;
    x: number;
    y: number;
  } | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [isInWebView, setIsInWebView] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const wasDraggedRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prevScaleRef = useRef<number>(1);
  const documentOptions = useMemo(
    () => ({
      cMapUrl: '/cmaps/',
      standardFontDataUrl: '/standard_fonts/',
      wasmUrl: '/wasm/',
    }),
    [],
  );

  // Disable page scrolling when a drawing/annotation tool is active (better UX on mobile)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (activeTool === 'none') {
      // Re-enable scrolling when tool is deselected
      if (scrollContainer) {
        scrollContainer.style.overflow = 'auto';
      }
      return;
    }

    // Disable body scrolling
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Disable scroll container scrolling
    if (scrollContainer) {
      scrollContainer.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      if (scrollContainer) {
        scrollContainer.style.overflow = 'auto';
      }
    };
  }, [activeTool]);

  // Detect if we're running inside a React Native WebView
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const inWebView = typeof (window as any).ReactNativeWebView !== 'undefined';
    setIsInWebView(inWebView);
  }, []);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: { numPages: number }): void {
    setNumPages(nextNumPages);
    setPageNumber(1);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    if (!numPages) return;
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  // Preserve scroll position when zooming
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || prevScaleRef.current === scale) return;

    const prevScale = prevScaleRef.current;
    const scaleRatio = scale / prevScale;

    // Get current scroll position and content dimensions before zoom
    const scrollLeft = scrollContainer.scrollLeft;
    const scrollTop = scrollContainer.scrollTop;
    const containerWidth = scrollContainer.clientWidth;
    const containerHeight = scrollContainer.clientHeight;
    const contentWidth = scrollContainer.scrollWidth;
    const contentHeight = scrollContainer.scrollHeight;

    // Calculate the point in content that's at the top-left of viewport
    const viewportX = scrollLeft;
    const viewportY = scrollTop;

    // Adjust scroll position after content resizes (wait for DOM update)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scrollContainer) {
          // Scale the viewport position
          const newScrollLeft = viewportX * scaleRatio;
          const newScrollTop = viewportY * scaleRatio;

          // Ensure we don't scroll beyond bounds
          const maxScrollLeft = Math.max(0, scrollContainer.scrollWidth - scrollContainer.clientWidth);
          const maxScrollTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);

          scrollContainer.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
          scrollContainer.scrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop));
        }
      });
    });

    prevScaleRef.current = scale;
  }, [scale]);

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.25));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(3, prev + 0.25));
  };

  const baseWidth = containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth;
  const pageWidth = baseWidth * scale;

  const handlePageClick = (event: MouseEvent<HTMLDivElement>, clickedPageNumber: number) => {
    if (activeTool === 'none') return;
    if (!numPages) return;

    // Ignore clicks that start on an existing annotation or if we just dragged
    const target = event.target as HTMLElement;
    if (target.closest('.Annotation')) return;
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    if (activeTool === 'text') {
      setAnnotations((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          pageNumber: clickedPageNumber,
          type: 'text',
          x,
          y,
          content: '',
          fontSize: 12,
        },
      ]);
    }

    if (activeTool === 'signature') {
      if (isSignatureModalOpen) return;

      setPendingSignaturePosition({
        pageNumber: clickedPageNumber,
        x,
        y,
      });
      setIsSignatureModalOpen(true);
    }
  };

  const handleTextChange = (id: string, value: string) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id && ann.type === 'text' ? { ...ann, content: value } : ann)),
    );
  };

  const changeTextFontSize = (id: string, delta: number) => {
    const MIN = 8;
    const MAX = 36;

    setAnnotations((prev) =>
      prev.map((ann) =>
        ann.id === id && ann.type === 'text'
          ? {
            ...ann,
            fontSize: Math.min(MAX, Math.max(MIN, (ann.fontSize ?? 12) + delta)),
          }
          : ann,
      ),
    );
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
  };

  const changeSignatureScale = (id: string, delta: number) => {
    const MIN = 0.5;
    const MAX = 2;

    setAnnotations((prev) =>
      prev.map((ann) =>
        ann.id === id && ann.type === 'signature'
          ? {
            ...ann,
            scale: Math.min(MAX, Math.max(MIN, (ann.scale ?? 1) + delta)),
          }
          : ann,
      ),
    );
  };

  const handleAnnotationPointerDown = (
    event: PointerEvent<HTMLDivElement>,
    annotation: Annotation,
  ) => {
    if (annotation.type !== 'text' && annotation.type !== 'signature') return;

    const target = event.target as HTMLElement;
    // Don't start drag when directly interacting with input field or buttons
    // But allow dragging from the container itself
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.closest('button') === target ||
      target.closest('input') === target
    ) {
      return;
    }

    const overlay = target.closest('.PageOverlay') as HTMLDivElement | null;
    if (!overlay) return;

    // Get the page element to calculate relative positions
    const pageElement = overlay.parentElement;
    if (!pageElement) return;

    const overlayRect = overlay.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = annotation.x;
    const originY = annotation.y;
    let hasMoved = false;
    wasDraggedRef.current = false;

    // Capture the pointer to prevent other interactions
    const annotationElement = event.currentTarget as HTMLElement;
    if (annotationElement && annotationElement.setPointerCapture) {
      annotationElement.setPointerCapture(event.pointerId);
    }

    const handleMove = (moveEvent: globalThis.PointerEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();

      const deltaX = (moveEvent.clientX - startX) / overlayRect.width;
      const deltaY = (moveEvent.clientY - startY) / overlayRect.height;

      // Use a slightly larger threshold to avoid accidental drags
      if (!hasMoved && (Math.abs(deltaX) > 0.005 || Math.abs(deltaY) > 0.005)) {
        hasMoved = true;
        wasDraggedRef.current = true;
      }

      if (hasMoved) {
        setAnnotations((prev) =>
          prev.map((ann) =>
            ann.id === annotation.id
              ? {
                ...ann,
                x: Math.min(1, Math.max(0, originX + deltaX)),
                y: Math.min(1, Math.max(0, originY + deltaY)),
              }
              : ann,
          ),
        );
      }
    };

    const handleUp = (upEvent: globalThis.PointerEvent) => {
      upEvent.preventDefault();
      upEvent.stopPropagation();

      if (annotationElement && annotationElement.releasePointerCapture) {
        try {
          annotationElement.releasePointerCapture(event.pointerId);
        } catch (e) {
          // Ignore errors if pointer capture was already released
        }
      }

      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };

    // Use capture phase to ensure we get events before other handlers
    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleUp, { passive: false });
    window.addEventListener('pointercancel', handleUp, { passive: false });

    event.preventDefault();
    event.stopPropagation();
  };

  const handleSignaturePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const handleSignaturePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopSignatureDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas || !pendingSignaturePosition) return;

    const dataUrl = canvas.toDataURL('image/png');

    setAnnotations((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        pageNumber: pendingSignaturePosition.pageNumber,
        type: 'signature',
        x: pendingSignaturePosition.x,
        y: pendingSignaturePosition.y,
        dataUrl,
        scale: 1,
      },
    ]);

    clearSignature();
    setPendingSignaturePosition(null);
    setIsSignatureModalOpen(false);
  };

  const cancelSignature = () => {
    clearSignature();
    setPendingSignaturePosition(null);
    setIsSignatureModalOpen(false);
  };
  
  const handleDownloadPdf = useCallback(async () => {
    if (!file || !numPages) {
      window.alert('No PDF loaded.');
      return;
    }

    try {
      let arrayBuffer: ArrayBuffer;

      if (typeof file === 'string') {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error('Failed to load PDF file');
        }
        arrayBuffer = await response.arrayBuffer();
      } else {
        arrayBuffer = await file.arrayBuffer();
      }

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const ann of annotations) {
        const pageIndex = ann.pageNumber - 1;
        const page = pages[pageIndex];
        if (!page) continue;

        const { width, height } = page.getSize();
        const xPos = ann.x * width;
        const yFromTop = ann.y * height;
        const baseY = height - yFromTop;

        if (ann.type === 'text') {
          const fontSize = ann.fontSize ?? 12;
          if (!ann.content.trim()) continue;

          page.drawText(ann.content, {
            x: xPos,
            y: baseY - fontSize / 2,
            size: fontSize,
            color: rgb(0, 0, 0),
          });
        } else if (ann.type === 'signature') {
          const pngImage = await pdfDoc.embedPng(ann.dataUrl);
          const baseDisplayWidth = 150;
          const scaleFactor = ann.scale ?? 1;
          const displayWidth = baseDisplayWidth * scaleFactor;
          const scale = displayWidth / pngImage.width;
          const pngDims = pngImage.scale(scale);

          const drawX = xPos - pngDims.width / 2;
          const drawY = baseY - pngDims.height / 2;

          page.drawImage(pngImage, {
            x: drawX,
            y: drawY,
            width: pngDims.width,
            height: pngDims.height,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const pdfArrayBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength,
      ) as ArrayBuffer;
      const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Upload to Supabase storage
      const supabase = createClient();
      const bucketName = "artist-waivers";
      const fileName = `signed-${Date.now()}.pdf`;
      const filePath = fileName;

      // Convert Blob to Uint8Array for Supabase upload
      const fileData = new Uint8Array(pdfArrayBuffer);

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileData, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading PDF to Supabase:', uploadError);
        throw new Error(`Failed to upload PDF: ${uploadError.message}`);
      }

      // Get public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      // In a normal browser environment, trigger a download.
      if (!isInWebView) {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'signed.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      // Expose the generated file back to the parent (e.g. main page)
      if (onSignedPdfReady) {
        onSignedPdfReady({ blob, objectUrl: url, supabaseUrl: publicUrl });
        // Do NOT revoke here; parent can revoke when done using the URL
      } else if (!isInWebView) {
        // If no callback is provided and we're not in a WebView, clean up the temporary URL.
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      window.alert('Failed to generate signed PDF.');
    }
  }, [annotations, file, isInWebView, numPages, onSignedPdfReady]);

  // Expose a global function so the React Native app can trigger PDF generation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).downloadSignedPdf = async () => {
      await handleDownloadPdf();
    };

    return () => {
      if (typeof window === 'undefined') return;
      if ((window as any).downloadSignedPdf) {
        delete (window as any).downloadSignedPdf;
      }
    };
  }, [handleDownloadPdf]);

  return (
    <div className="h-screen overflow-hidden w-full bg-background text-white font-sans py-16">
      <header className="fixed w-full top-0 left-0 right-0 z-50 bg-background shadow-md">
        <div className="mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={activeTool === 'text' ? 'Disable text tool' : 'Enable text tool'}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-white ${activeTool === 'text'
                ? 'bg-emerald-500 shadow-md'
                : 'bg-slate-600 hover:bg-slate-500'
                }`}
              onClick={() => setActiveTool((tool) => (tool === 'text' ? 'none' : 'text'))}
            >
              <Type className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={activeTool === 'signature' ? 'Disable signature tool' : 'Enable signature tool'}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-white ${activeTool === 'signature'
                ? 'bg-emerald-500 shadow-md'
                : 'bg-slate-600 hover:bg-slate-500'
                }`}
              onClick={() => setActiveTool((tool) => (tool === 'signature' ? 'none' : 'signature'))}
            >
              <PenSquare className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-slate-600 px-2 py-1 text-xs text-slate-100 shadow-sm">
            <button
              type="button"
              aria-label="Zoom out"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-500 disabled:opacity-40"
              onClick={zoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="mx-1 w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
            <button
              type="button"
              aria-label="Zoom in"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-500 disabled:opacity-40"
              onClick={zoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>
          {!isInWebView && (
            <button
              type="button"
              aria-label="Download signed PDF"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500"
              onClick={handleDownloadPdf}
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>
      <div
        className="h-[calc(100vh-8rem)] overflow-auto scroll-smooth"
        ref={(node) => {
          setContainerRef(node);
          scrollContainerRef.current = node;
        }}
      >
        <div className="flex min-w-full flex-col gap-4">
          <div className="flex justify-center w-full min-w-fit">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              options={documentOptions}
              className="flex flex-col items-center"
            >
              {numPages &&
                Array.from({ length: numPages }, (_, index) => {
                  const currentPageNumber = index + 1;
                  return (
                    <div
                      className="relative mb-4 inline-block"
                      key={`page_${currentPageNumber}`}
                    >
                      <Page
                        pageNumber={currentPageNumber}
                        width={pageWidth}
                        className="shadow-lg"
                      />
                      <div
                        className="PageOverlay absolute inset-0 z-10 cursor-crosshair"
                        onClick={(event) => handlePageClick(event, currentPageNumber)}
                      >
                        {annotations
                          .filter((ann) => ann.pageNumber === currentPageNumber)
                          .map((ann) =>
                            ann.type === 'text'
                              ? (
                                <div
                                  key={ann.id}
                                  className="Annotation absolute inline-flex flex-col gap-0.5 rounded border border-black/20 bg-white/85 p-1 text-xs text-gray-900 shadow-[0_0_0_1px_rgba(59,130,246,0.4)] cursor-move touch-none"
                                  style={{ left: `calc(${ann.x * 100}% - 10px)`, top: `calc(${ann.y * 100}% - 10px)` }}
                                  onPointerDown={(event) => handleAnnotationPointerDown(event, ann)}
                                >
                                  <div className="flex items-center gap-1">
                                    <input
                                      className="min-w-[120px] max-w-[200px] rounded border-0 bg-gray-50 px-1 py-0.5 text-xs text-gray-900 outline-none pointer-events-auto"
                                      value={ann.content}
                                      placeholder="Aa"
                                      style={{ fontSize: `${ann.fontSize ?? 12}px` }}
                                      onChange={(e) => handleTextChange(ann.id, e.target.value)}
                                      onPointerDown={(e) => e.stopPropagation()}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                      type="button"
                                      className="ml-1 border-0 bg-transparent px-1 text-xs text-red-500 pointer-events-auto"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteAnnotation(ann.id);
                                      }}
                                      onPointerDown={(e) => e.stopPropagation()}
                                    >
                                      🗑
                                    </button>
                                  </div>
                                  <div className="mt-0.5 flex items-center gap-1">
                                    <div className="inline-flex items-center gap-0.5 rounded border border-black/10 bg-gray-50 px-1 py-0.5 pointer-events-auto">
                                      <button
                                        type="button"
                                        className="border-0 bg-transparent px-1 text-xs opacity-60"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          changeTextFontSize(ann.id, -1);
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                      >
                                        -
                                      </button>
                                      <span className="text-[11px] text-gray-700">
                                        Aa
                                      </span>
                                      <button
                                        type="button"
                                        className="border-0 bg-transparent px-1 text-xs opacity-60"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          changeTextFontSize(ann.id, 1);
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                              : (
                                <div
                                  key={ann.id}
                                  className="Annotation absolute -translate-x-1/2 -translate-y-1/2 cursor-move touch-none"
                                  style={{ left: `${ann.x * 100}%`, top: `${ann.y * 100}%` }}
                                  onPointerDown={(event) => handleAnnotationPointerDown(event, ann)}
                                >
                                  <img
                                    src={ann.dataUrl}
                                    alt="Signature"
                                    className="select-none pointer-events-none"
                                    draggable={false}
                                    style={{ width: `${120 * (ann.scale ?? 1)}px` }}
                                  />
                                  <div className="mt-0.5 flex justify-center gap-1 pointer-events-auto">
                                    <button
                                      type="button"
                                      className="border-0 bg-black/40 px-1 text-[10px] text-white rounded"
                                      onClick={(e) => {
                                        if (wasDraggedRef.current) {
                                          e.preventDefault();
                                          wasDraggedRef.current = false;
                                          return;
                                        }
                                        e.stopPropagation();
                                        changeSignatureScale(ann.id, -0.1);
                                      }}
                                      onPointerDown={(e) => e.stopPropagation()}
                                    >
                                      -
                                    </button>
                                    <button
                                      type="button"
                                      className="border-0 bg-black/40 px-1 text-[10px] text-white rounded"
                                      onClick={(e) => {
                                        if (wasDraggedRef.current) {
                                          e.preventDefault();
                                          wasDraggedRef.current = false;
                                          return;
                                        }
                                        e.stopPropagation();
                                        changeSignatureScale(ann.id, 0.1);
                                      }}
                                      onPointerDown={(e) => e.stopPropagation()}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ),
                          )}
                      </div>
                    </div>
                  );
                })}
            </Document>
          </div>
        </div>
      </div>
      <div className='fixed bg-background left-0 right-0 bottom-0 items-center justify-center p-4'>
        <Button
          variant='outline'
          type="submit"
          className="w-full rounded-full"
          size="lg"
          onClick={handleDownloadPdf}
        >
          Sign
        </Button>
      </div>

      {isSignatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg bg-gray-900 p-4 text-sm text-white shadow-xl">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Draw signature</span>
              {pendingSignaturePosition && (
                <span className="text-xs text-gray-400">
                  Page {pendingSignaturePosition.pageNumber}
                </span>
              )}
            </div>
            <canvas
              ref={signatureCanvasRef}
              width={400}
              height={150}
              className="SignaturePad__canvas h-auto w-full rounded-md bg-gray-50 touch-none"
              onPointerDown={handleSignaturePointerDown}
              onPointerMove={handleSignaturePointerMove}
              onPointerUp={stopSignatureDrawing}
              onPointerLeave={stopSignatureDrawing}
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                className="rounded bg-slate-600 px-3 py-1 text-sm text-white hover:bg-slate-500"
                onClick={clearSignature}
              >
                Clear
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded bg-slate-600 px-3 py-1 text-sm text-white hover:bg-slate-500"
                  onClick={cancelSignature}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
                  onClick={saveSignature}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}