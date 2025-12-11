'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useRef, Suspense } from 'react';
import { PDFDocument } from 'pdf-lib';

type ReactNativeWebViewBridge = { postMessage: (message: string) => void };

const PdfEditor = dynamic(() => import('@/components/common/PdfEditor'), {
  ssr: false,
});

function SignPageContent() {
  const searchParams = useSearchParams();
  const waiverUrl = searchParams.get('waiver');
  const [isMounted, setIsMounted] = useState(false);
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState<string | null>(null);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const getReactNativeWebView = useCallback((): ReactNativeWebViewBridge | undefined => {
    if (typeof window === 'undefined') return undefined;
    return (window as typeof window & { ReactNativeWebView?: ReactNativeWebViewBridge }).ReactNativeWebView;
  }, []);

  // Check if we're in a React Native WebView
  const checkWebView = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const bridge = getReactNativeWebView();
    const isInWebView = Boolean(bridge);
    console.log('🔍 WebView Check:', {
      isInWebView,
      hasWindow: typeof window !== 'undefined',
      hasReactNativeWebView: Boolean(bridge),
      ReactNativeWebView: bridge,
    });
    return isInWebView;
  }, [getReactNativeWebView]);

  const [isInWebView, setIsInWebView] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkCountRef = useRef(0);
  const MAX_CHECKS = 10; // Maximum 10 seconds of checking

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const convertImageBlobToPdf = async (blob: Blob, mimeType: string) => {
    const pdfDoc = await PDFDocument.create();

    let imageBlob = blob;
    let currentMimeType = mimeType;
    const isPng = () => currentMimeType.includes('png');
    const isJpeg = () => currentMimeType.includes('jpg') || currentMimeType.includes('jpeg');

    // Convert unsupported image formats to PNG via canvas as a fallback
    if (!isPng() && !isJpeg()) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(blob);
      });

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = dataUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is not supported');
      ctx.drawImage(img, 0, 0);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error('Failed to convert image to PNG'));
        }, 'image/png');
      });

      imageBlob = pngBlob;
      currentMimeType = 'image/png';
    }

    const imageBytes = new Uint8Array(await imageBlob.arrayBuffer());
    const image = isPng()
      ? await pdfDoc.embedPng(imageBytes)
      : await pdfDoc.embedJpg(imageBytes);

    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });

    const pdfBytes = await pdfDoc.save();
    const pdfArrayBuffer = Uint8Array.from(pdfBytes).buffer;
    return new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  };

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check WebView availability on mount and periodically
  useEffect(() => {
    if (!isMounted) return;

    const check = () => {
      const result = checkWebView();

      // Only update state if the value actually changed to prevent unnecessary re-renders
      setIsInWebView((prev) => prev !== result ? result : prev);

      return result;
    };

    // Check immediately
    const initialResult = check();

    // If WebView is already available, no need to check periodically
    if (initialResult) return;

    // Check periodically in case WebView loads later
    checkCountRef.current = 1; // We already did one check
    intervalRef.current = setInterval(() => {
      checkCountRef.current += 1;

      // Stop after maximum number of checks
      if (checkCountRef.current > MAX_CHECKS) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const result = check();
      // Stop checking once WebView is detected
      if (result && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      checkCountRef.current = 0;
    };
  }, [checkWebView, isMounted]);

  // Prepare a PDF source from the waiverUrl (supports image URLs by converting to PDF)
  useEffect(() => {
    if (!waiverUrl) return;

    let cancelled = false;

    const prepare = async () => {
      setIsPreparingPdf(true);
      setPrepareError(null);
      revokeObjectUrl();

      try {
        const lowerUrl = waiverUrl.toLowerCase();

        // Quick extension check
        if (lowerUrl.endsWith('.pdf')) {
          setResolvedPdfUrl(waiverUrl);
          return;
        }

        const response = await fetch(waiverUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch waiver file');
        }

        const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';

        // If server says it's a PDF, use it directly
        if (contentType.includes('pdf')) {
          setResolvedPdfUrl(waiverUrl);
          return;
        }

        const fileBlob = await response.blob();
        const mimeType = (fileBlob.type || contentType || '').toLowerCase();
        const extensionMatch = lowerUrl.match(/\.(png|jpe?g|webp|gif)$/);
        const guessedMime = extensionMatch
          ? `image/${extensionMatch[1] === 'jpg' ? 'jpeg' : extensionMatch[1]}`
          : '';
        const effectiveMimeType = mimeType || guessedMime;
        const isImage = effectiveMimeType.startsWith('image/') || Boolean(extensionMatch);

        // If not an image, fall back to original URL
        if (!isImage) {
          setResolvedPdfUrl(waiverUrl);
          return;
        }

        const pdfBlob = await convertImageBlobToPdf(fileBlob, effectiveMimeType || 'image/png');
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(pdfBlob);
        objectUrlRef.current = objectUrl;
        setResolvedPdfUrl(objectUrl);
      } catch (error) {
        console.error('Error preparing waiver file:', error);
        if (!cancelled) {
          setPrepareError('Could not prepare the document. Please try again.');
          setResolvedPdfUrl(null);
        }
      } finally {
        if (!cancelled) {
          setIsPreparingPdf(false);
        }
      }
    };

    prepare();

    return () => {
      cancelled = true;
      revokeObjectUrl();
    };
  }, [waiverUrl]);

  const handleSignedPdfReady = async ({ blob, objectUrl, supabaseUrl }: { blob: Blob; objectUrl: string; supabaseUrl: string }) => {
    try {
      if (isInWebView) {
        // Use Supabase URL if available, otherwise fall back to base64
        const message = JSON.stringify({
          type: 'SIGNED_PDF_READY',
          payload: {
            downloadUrl: supabaseUrl, // Send Supabase public URL
          },
        });

        console.log('Sending Supabase PDF URL to React Native:', supabaseUrl);

        // Send the message to React Native
        const bridge = getReactNativeWebView();
        bridge?.postMessage(message);
      } else {
        // For browser testing, log the Supabase URL
        console.log('Signed PDF ready', { blob, objectUrl, supabaseUrl });
        // router.push('/'); // or your main page route
      }
    } catch (error) {
      console.error('Error in handleSignedPdfReady:', error);
    }
  };

  if (!waiverUrl) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No PDF file provided. Please provide a file parameter in the URL.</p>
      </div>
    );
  }

  if (prepareError) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>{prepareError}</p>
      </div>
    );
  }

  if (isPreparingPdf || !resolvedPdfUrl) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Preparing document...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <PdfEditor
        pdfUrl={resolvedPdfUrl}
        onSignedPdfReady={handleSignedPdfReady}
      />
    </div>
  );
}

function SignPage() {
  return (
    <Suspense fallback={
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    }>
      <SignPageContent />
    </Suspense>
  );
}

export default SignPage;

