'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const PdfEditor = dynamic(() => import('@/components/common/PdfEditor'), {
  ssr: false,
});

function SignPage() {
  const searchParams = useSearchParams();
  const waiverUrl = searchParams.get('waiver');
  const router = useRouter();
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check if we're in a React Native WebView
  const checkWebView = () => {
    if (typeof window === 'undefined') return false;
    const isInWebView = typeof (window as any).ReactNativeWebView !== 'undefined';
    console.log('🔍 WebView Check:', {
      isInWebView,
      hasWindow: typeof window !== 'undefined',
      hasReactNativeWebView: typeof (window as any).ReactNativeWebView !== 'undefined',
      ReactNativeWebView: (window as any).ReactNativeWebView,
    });
    return isInWebView;
  };

  const [isInWebView, setIsInWebView] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkCountRef = useRef(0);
  const MAX_CHECKS = 10; // Maximum 10 seconds of checking

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
      setIsWebViewReady((prev) => prev !== result ? result : prev);

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
  }, [isMounted]);

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
        (window as any).ReactNativeWebView.postMessage(message);
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

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <PdfEditor
        pdfUrl={waiverUrl}
        onSignedPdfReady={handleSignedPdfReady}
      />
    </div>
  );
}

export default SignPage;

