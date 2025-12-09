import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import BookingRequest from '@/app/emails/BookingRequest';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: 'RESEND_API_KEY environment variable is not set'
            }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        const { to, variables, avatar_url } = await req.json();

        if (!to || !variables || !avatar_url) {
            return NextResponse.json({
                error: "Missing or invalid fields. Expected { to, variables, payment_links, avatar_url }"
            }, { status: 400 });
        }

        const html = await render(BookingRequest({ variables, avatar_url }));

        const data = await resend.emails.send({
            from: 'Simple Tattooer <noreply@simpletattooer.com>', // must be verified in Resend
            to,
            subject: 'Booking Request Received',
            html,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}