import * as React from 'react';
import {
    Body,
    Button,
    Column,
    Container,
    Font,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import { getVariable, renderTemplate, normalizeKey } from '@/lib/utils/emails';

type ClientNewProps = {
    email_templates: {
        subject: string;
        body: string;
    };
    avatar_url: string;
    variables?: Record<string, string | readonly string[]>;
    action_links?: Record<string, string>;
};


const emailTemplates = {
    subject: "Your tattoo is confirmed & your client portal is ready",
    body: "Hi [Client First Name],\n\nI'm so excited to be working with you. As a perk of being my client, you now get access to your exclusive Client Portal — powered by Simple Tattooer.\n\nYour tattoo is confirmed for:\n[Date, Time, location]\n\nYou'll receive your appointment confirmation and reminders by email. To manage your booking and message your artist\n\nDownload our app for free below — no passwords needed. Everything you need is always one click away.\n\n(Button- Start Here)\n\nInside your personal dashboard, you'll find your appointment details, payment info and receipts, my aftercare + FAQ pages, a reschedule/cancel button if anything changes, and a direct message portal to reach me anytime. \n\nThis is your private space — built just for you.\n\nCan't wait to see you soon,\n[Your Name]\n[Studio Name]"
}

const tempVariables = {
    "Client First Name": "Sam",
    "Date, Time, location": [
        "Nov 20, 2025 — 2:00 PM, Toronto studio",
        "Nov 22, 2025 — 4:00 PM, Toronto studio"
    ],
    "Your Name": "Daniel Lee",
    "Studio Name": "Simple Tattooer",
    "Start Here": "https://simpletattooer.com/client-portal?id=234234-2342-234234-3242asd",
} as const;

const defaultAvatarUrl = "https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/icons/dummy_photo.png";

const defaultActionLinks = {
    "Start Here": "https://simpletattooer.com/client-portal?id=234234-2342-234234-3242asd",
} as const;

const ClientNew = ({
    variables = tempVariables,
    email_templates = emailTemplates,
    avatar_url = defaultAvatarUrl,
    action_links = defaultActionLinks
}: ClientNewProps) => {

    const resolvedSubject = renderTemplate(email_templates.subject, variables);
    const resolvedBody = renderTemplate(email_templates.body, variables);

    const artistName = getVariable(variables, 'Your Name', 'Simple Tattooer');
    const previewText = (resolvedBody.split('\n').find((l) => l.trim().length > 0)) ?? "Thanks for sending your idea my way!";

    type Segment = { type: 'text'; content: string } | { type: 'button'; label: string };

    const parseBodySegments = (text: string): Segment[] => {
        const segments: Segment[] = [];
        const regex = /\(Button-\s*([^)]+)\)/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            const idx = match.index;
            if (idx > lastIndex) {
                segments.push({ type: 'text', content: text.slice(lastIndex, idx) });
            }
            const label = match[1].trim();
            segments.push({ type: 'button', label });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            segments.push({ type: 'text', content: text.slice(lastIndex) });
        }
        return segments;
    };

    const segments = parseBodySegments(resolvedBody);

    // Get the date/time/location value(s) to detect them in lines
    const dateTimeLocationVar = variables['Date, Time, location'] ||
        Object.entries(variables).find(([k]) => normalizeKey(k) === normalizeKey('Date, Time, location'))?.[1];
    const dateTimeLocationValues = Array.isArray(dateTimeLocationVar)
        ? dateTimeLocationVar
        : dateTimeLocationVar ? [dateTimeLocationVar] : [];

    const renderTextWithBreaks = (text: string) => {
        const parts: React.ReactNode[] = [];
        // Remove leading newlines
        const trimmedText = text.replace(/^\n+/, '');
        const lines = trimmedText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.length > 0) {
                // Check if this line matches any date/time/location value and add bullet point
                const trimmedLine = line.trim();
                const matchesDateTime = dateTimeLocationValues.some(val => {
                    const valStr = typeof val === 'string' ? val : String(val);
                    return trimmedLine === valStr || trimmedLine.startsWith(valStr);
                });
                if (matchesDateTime) {
                    parts.push(`• ${line.trim()}`);
                } else {
                    parts.push(line);
                }
            }
            if (i < lines.length - 1) parts.push(<br key={`br-${i}-${line.length}`} />);
        }
        return parts;
    };

    const resolveButtonHref = (label: string): string => {
        // Prefer variable value with label name, fallback to action_links[label], then default known mapping
        const fromVar = getVariable(variables, label, '');
        if (fromVar) return fromVar;
        if (action_links[label]) return action_links[label];
        if (defaultActionLinks[label as keyof typeof defaultActionLinks]) {
            return defaultActionLinks[label as keyof typeof defaultActionLinks];
        }
        // Ultimate fallback
        return defaultActionLinks['Start Here'];
    };

    return (
        <Html style={{ colorScheme: 'light' }}>
            <Tailwind>
                <Head>
                    <meta name="color-scheme" content="light dark" />
                    <meta name="supported-color-schemes" content="light dark" />
                    <Font
                        fontFamily="Arial"
                        fallbackFontFamily="Arial"
                        webFont={{
                            url: "https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/fonts/arial_ce.woff2",
                            format: "woff2",
                        }}
                        fontWeight={400}
                        fontStyle="normal"
                    />
                    {/* Email-safe responsive helpers and dark mode protection */}
                    <style>
                        {`
                            .desktop-hide { display: none !important; }
                            @media only screen and (max-width: 480px) {
                                .mobile-block { display: block !important; width: 100% !important; }
                                .mobile-center { text-align: center !important; }
                                .mobile-hide { display: none !important; }
                                .mobile-mt-16 { margin-top: 16px !important; }
                            }
                            /* Prevent iOS Mail app dark mode color inversion */
                            @media (prefers-color-scheme: dark) {
                                body, table, td {
                                    color: #F0F0F0 !important;
                                    background-color: #05080F !important;
                                }
                            }
                        `}
                    </style>
                </Head>
                <Preview>{previewText}</Preview>
                <Body className="mx-auto my-auto max-w-[600px]">
                    <Container className="mx-auto max-w-[600px] py-[40px] px-4" style={{ backgroundColor: '#05080F' }}>
                        {/* Header with title and avatar */}
                        <Section className="mx-auto max-w-[472px]" style={{ backgroundColor: '#05080F' }}>
                            <Row>
                                <Column className="mobile-block desktop-hide mb-5" align="center">
                                    <Img
                                        src={avatar_url}
                                        alt={artistName}
                                        width="100"
                                        height="100"
                                        style={{ borderRadius: '50px', objectFit: 'cover' }}
                                    />
                                </Column>
                                <Column className="mobile-block" style={{ verticalAlign: 'middle' }}>
                                    <Heading style={{ color: '#F0F0F0' }} className="text-[24px] font-normal p-0 m-0 text-left mobile-center">{resolvedSubject}</Heading>
                                    <Text style={{ color: '#F0F0F0' }} className="text-[16px] leading-[20px] my-0 mt-2 mobile-center">with {artistName}</Text>
                                </Column>
                                <Column className="mobile-hide" align="right" style={{ verticalAlign: 'middle' }}>
                                    <Img
                                        src={avatar_url}
                                        alt={artistName}
                                        width="100"
                                        height="100"
                                        style={{ borderRadius: '50px', objectFit: 'cover' }}
                                    />
                                </Column>
                            </Row>
                        </Section>

                        {/* Body copy */}
                        <Section className='mt-[28px] mx-auto max-w-[472px]' style={{ backgroundColor: '#05080F' }}>
                            {segments.map((seg, idx) => {
                                if (seg.type === 'text') {
                                    const content = seg.content;
                                    if (!content) return null;
                                    return (
                                        <Text key={`t-${idx}`} style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[22px] my-0">
                                            {renderTextWithBreaks(content)}
                                        </Text>
                                    );
                                }
                                const href = resolveButtonHref(seg.label);
                                return (
                                    <Button
                                        key={`b-${idx}`}
                                        className="w-full text-[14px] font-normal no-underline text-center px-5"
                                        href={href}
                                        style={{ color: '#F0F0F0', height: '40px', lineHeight: '38px', display: 'block', maxWidth: '100%', boxSizing: 'border-box', borderRadius: '20px', border: '1px solid #94A3B8', marginBottom: '25px' }}
                                    >
                                        {seg.label}
                                    </Button>
                                );
                            })}
                        </Section>

                        {/* Footer */}
                        <Section className='mt-[28px] mx-auto max-w-[472px]' style={{ backgroundColor: '#05080F !important' }}>
                            <Row>
                                <Column className="mobile-block" style={{ verticalAlign: 'top' }}>
                                    <Text style={{ color: '#F0F0F0 !important' }} className="text-[10px] leading-[14px] my-0 mb-2">Download Our App</Text>
                                    <Row>
                                        <Column align='left'>
                                            <Link href="https://play.google.com/store">
                                                <Img
                                                    src="https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/icons/android_store_btn.png"
                                                    alt="Get it on Google Play"
                                                    width="96"
                                                    height="32"
                                                    style={{ display: 'inline' }}
                                                />
                                            </Link>
                                            &nbsp;&nbsp;
                                            <Link href="https://apps.apple.com/app">
                                                <Img
                                                    src="https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/icons/apple_store_btn.png"
                                                    alt="Download on the App Store"
                                                    width="96"
                                                    height="32"
                                                    style={{ display: 'inline' }}
                                                />
                                            </Link>
                                        </Column>
                                    </Row>
                                </Column>
                                <Column className="mobile-block mobile-mt-16" width="45px" style={{ verticalAlign: 'top' }}>
                                    <Text style={{ color: '#F0F0F0 !important' }} className="text-[10px] leading-[14px] my-0 mb-2">Follow Us</Text>
                                    <Link href="https://instagram.com" target="_blank">
                                        <Img
                                            src="https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/icons/mdi_instagram.png"
                                            alt="Instagram"
                                            width="24"
                                            height="24"
                                        />
                                    </Link>
                                </Column>
                            </Row>
                            <Hr style={{ borderColor: '#1E293B !important' }} />
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[12px] leading-[16px] my-0 mt-3">© 2025 Simple Tattooer. All Rights Reserved</Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default ClientNew;