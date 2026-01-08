import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ArtistReschedule from '@/app/emails/Reschedule';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: 'RESEND_API_KEY environment variable is not set'
            }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        const { to, artistName, clientName, reason, originalDate, originalTime, bookingLink, studioName, avatar_url } = await req.json();

        if (!to || !artistName || !clientName || !reason || !originalDate || !originalTime || !bookingLink || !studioName || !avatar_url) {
            return NextResponse.json({
                error: "Missing or invalid fields. Expected { to, artistName, clientName, reason, originalDate, originalTime, bookingLink, studioName, avatar_url }"
            }, { status: 400 });
        }

        const html = await render(ArtistReschedule({ artistName, clientName, reason, originalDate, originalTime, bookingLink, studioName, avatar_url }));

        const data = await resend.emails.send({
            from: 'Simple Tattooer <noreply@simpletattooer.com>', // must be verified in Resend
            to,
            subject: 'Need to reschedule our appointment',
            html,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}