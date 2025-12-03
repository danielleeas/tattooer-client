import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '@/app/emails/Welcome';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { to, artistName, artistBookingLink: bookingLink } = await req.json();

        if (!to || !artistName || !bookingLink) {
            return NextResponse.json({
                error: "Missing or invalid fields. Expected { to, artistName, artistBookingLink }"
            }, { status: 400 });
        }

        const html = await render(WelcomeEmail({ artistName, bookingLink }));

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