import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ClientPortalEmail from '@/app/emails/ClientPortal';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: 'RESEND_API_KEY environment variable is not set'
            }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        const { to, artistName, portalLink, avatar_url, clientName, studioName } = await req.json();

        if (!to || !artistName || !portalLink || !avatar_url || !clientName || !studioName) {
            return NextResponse.json({
                error: "Missing or invalid fields. Expected { to, artistName, portalLink, avatar_url, clientName, studioName }"
            }, { status: 400 });
        }

        const html = await render(ClientPortalEmail({ artistName, portalLink, avatar_url, clientName, studioName }));

        const data = await resend.emails.send({
            from: 'Simple Tattooer <noreply@simpletattooer.com>', // must be verified in Resend
            to,
            subject: 'Welcome to Simple Tattooer!',
            html,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}