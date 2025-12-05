import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import AutoBookingRequest from '@/app/emails/AutoBookingRequest';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: 'RESEND_API_KEY environment variable is not set'
            }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        const { to, email_templates, avatar_url, variables, action_links } = await req.json();

        if (
            (!to) ||
            (!email_templates || typeof email_templates.subject !== "string" || typeof email_templates.body !== "string") ||
            (!avatar_url || typeof avatar_url !== "string") ||
            (!variables || typeof variables !== "object") ||
            (!action_links || typeof action_links !== "object")
        ) {
            return NextResponse.json({
                error: "Missing or invalid fields. Expected { to, email_templates{subject,body}, avatar_url, variables, payment_links }"
            }, { status: 400 });
        }

        const html = await render(AutoBookingRequest({ email_templates, avatar_url, variables, action_links }));

        const data = await resend.emails.send({
            from: 'Simple Tattooer <noreply@simpletattooer.com>', // must be verified in Resend
            to,
            subject: email_templates.subject,
            html,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}