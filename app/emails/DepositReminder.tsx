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

type ReturnClientProps = {
    email_templates: {
        subject: string;
        body: string;
    };
    avatar_url: string;
    variables?: Record<string, string | readonly string[]>;
};

function normalizeKey(key: string): string {
    return key.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getVariable(variables: Record<string, string | readonly string[]>, name: string, fallback: string): string {
    const target = normalizeKey(name);
    for (const [k, v] of Object.entries(variables)) {
        if (normalizeKey(k) === target) {
            if (Array.isArray(v)) return v.join('\n');
            if (typeof v === 'string') return v;
            return fallback;
        }
    }
    return fallback;
}

function renderTemplate(template: string, variables: Record<string, string | readonly string[]>): string {
    if (!template) return '';
    // Replace [key] - always keep wrapper if missing
    let result = template.replace(/\[([^\]]+)\]/g, (_match, key: string) => {
        if (key in variables) {
            const val = variables[key];
            if (Array.isArray(val)) return val.join('\n');
            return typeof val === 'string' ? val : '';
        }
        const normalized = normalizeKey(key);
        for (const [k, v] of Object.entries(variables)) {
            if (normalizeKey(k) === normalized) {
                if (Array.isArray(v)) return v.join('\n') ?? '';
                return typeof v === 'string' ? v : '';
            }
        }
        return `[${key}]`;
    });
    // Replace (key) - only replace if variable exists, otherwise keep as-is
    result = result.replace(/\(([^)]+)\)/g, (match: string, key: string) => {
        const hasDirect = key in variables;
        let found: string | readonly string[] | undefined;
        if (hasDirect) {
            found = variables[key];
        } else {
            const normalized = normalizeKey(key);
            for (const [k, v] of Object.entries(variables)) {
                if (normalizeKey(k) === normalized) {
                    found = v;
                    break;
                }
            }
        }
        if (found === undefined) return match;
        if (Array.isArray(found)) return found.join('\n');
        return typeof found === 'string' ? found : match;
    });
    return result;
}

const emailTemplates = {
    subject: "Deposit still needed to confirm your dates",
    body: "Hi [Client First Name],\n\nHey! Just a quick nudge — your deposit hasn’t come through yet. Please pay by [deadline] to keep your spot."
}

const tempVariables = {
    "Client First Name": "Sam",
    "deadline": "2025-12-15 4:00 PM"
} as const;

const defaultAvatarUrl = "https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/icons/dummy_photo.png";

const DepositReminderEmail = ({
    variables = tempVariables,
    email_templates = emailTemplates,
    avatar_url = defaultAvatarUrl,
}: ReturnClientProps) => {

    const resolvedSubject = renderTemplate(email_templates.subject, variables);
    const resolvedBody = renderTemplate(email_templates.body, variables);

    const artistName = getVariable(variables, 'Your Name', 'Simple Tattooer');
    const previewText = (resolvedBody.split('\n').find((l) => l.trim().length > 0)) ?? "Your tattoo is confirmed!";

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

    return (
        <Html>
            <Tailwind>
                <Head>
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
                    {/* Email-safe responsive helpers */}
                    <style>
                        {`
                        .desktop-hide { display: none !important; }
                        @media only screen and (max-width: 480px) {
                            .mobile-block { display: block !important; width: 100% !important; }
                            .mobile-center { text-align: center !important; }
                            .mobile-hide { display: none !important; }
                            .mobile-mt-16 { margin-top: 16px !important; }
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
                                    <Heading style={{ color: '#FFFFFF' }} className="text-[24px] font-normal p-0 m-0 text-left mobile-center">{resolvedSubject}</Heading>
                                    <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mt-2 mobile-center">with {artistName}</Text>
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
                                        <Text key={`t-${idx}`} style={{ color: '#FFFFFF' }} className="text-[16px] leading-[22px] my-0">
                                            {renderTextWithBreaks(content)}
                                        </Text>
                                    );
                                }
                            })}
                        </Section>

                        {/* Footer */}
                        <Section className='mt-[28px] mx-auto max-w-[472px] bg-[#05080F]'>
                            <Row>
                                <Column className="mobile-block" style={{ verticalAlign: 'top' }}>
                                    <Text className="text-white text-[10px] leading-[14px] my-0 mb-2">Download Our App</Text>
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
                                    <Text className="text-white text-[10px] leading-[14px] my-0 mb-2">Follow Us</Text>
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
                            <Hr style={{ borderColor: '#1E293B' }} />
                            <Text className="text-white text-[12px] leading-[16px] my-0 mt-3">© 2025 Simple Tattooer. All Rights Reserved</Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default DepositReminderEmail;