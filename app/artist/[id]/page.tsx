import { createClient } from "@/lib/supabase/client";
import { getBaseUrl, joinUrl } from "@/lib/utils";

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const baseUrl = getBaseUrl();
    const bookingLink = joinUrl(baseUrl, id);

    let artists = null;
    let error = null;

    try {
        const supabase = createClient();
        const result = await supabase.from("artists").select();
        artists = result.data;
        error = result.error;
    } catch (err) {
        console.error('Failed to create Supabase client or execute query:', err);
        error = err instanceof Error ? {
            message: err.message,
            details: err.stack,
            code: 'CLIENT_ERROR',
        } : {
            message: String(err),
            code: 'UNKNOWN_ERROR',
        };
    }

    if (error) {
        console.error('Supabase query error:', error);

        // Check for connection timeout errors
        if (error.message?.includes('fetch failed') ||
            error.message?.includes('timeout') ||
            error.message?.includes('ConnectTimeoutError') ||
            error.message?.includes('Request timeout')) {
            console.error('Connection timeout detected. Possible causes:');
            console.error('1. Network/firewall blocking connection to Supabase');
            console.error('2. Supabase project might be paused (check Supabase dashboard)');
            console.error('3. VPN or proxy interfering with connection');
            console.error('4. DNS resolution issues');
            console.error('5. Corporate firewall blocking external connections');
            console.error(`Attempted URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set'}`);
            console.error('\nTroubleshooting steps:');
            console.error('- Check if your Supabase project is active in the dashboard');
            console.error('- Try accessing the Supabase URL directly in a browser');
            console.error('- Check if your network/firewall allows outbound HTTPS connections');
            console.error('- If using VPN, try disconnecting and test again');
            console.error('- Verify DNS resolution: nslookup tjjrudvrkeokfqmvkues.supabase.co');
        }
    }

    console.log('Artists data:', artists);

    return (
        <div>
            <h1>Artist Page</h1>
            <p>Artist ID: {id}</p>
            <p>Base URL: {baseUrl}</p>
            <p>Booking Link: {bookingLink}</p>
        </div>
    );
}