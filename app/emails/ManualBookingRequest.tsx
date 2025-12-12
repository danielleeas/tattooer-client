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
import { getBaseUrl, joinUrl } from '@/lib/utils';
import { getVariable, renderTemplate } from '@/lib/utils/emails';

type ManualBookingRequestProps = {
    // Map of placeholder key -> value, e.g. { "Client First Name": "Sam", "auto-fill-title": "Floral sleeve" }
    email_templates: {
        subject: string;
        body: string;
    };
    avatar_url: string;
    variables?: Record<string, string | readonly string[]>;
    payment_links?: Record<string, string>;
};

function isUrl(value: string): boolean {
    // Trim whitespace
    const trimmed = value.trim();
    if (!trimmed) return false;

    // Check if it has a protocol (http:// or https://)
    if (/^https?:\/\//i.test(trimmed)) {
        try {
            const url = new URL(trimmed);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return true; // If it starts with http:// or https://, treat as URL
        }
    }

    // Check if it looks like a domain name (without protocol)
    // Must contain at least one dot and look like a valid domain
    // Pattern: alphanumeric, hyphens, dots allowed; must have at least one dot; 
    // must end with valid TLD (2+ chars after last dot); no spaces
    const domainPattern = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    
    // Additional check: must not contain spaces, and should have at least one dot
    if (trimmed.includes(' ') || !trimmed.includes('.')) {
        return false;
    }

    // Check if it matches domain pattern
    if (domainPattern.test(trimmed)) {
        return true;
    }

    // Also check for common URL patterns like paypal.me (short domains)
    // These might not have a dot but are still valid domains
    // For now, we'll rely on the dot requirement, but we can add exceptions
    // For very short domains like "paypal.me", the pattern above should catch them

    return false;
}

const emailTemplates = {
    subject: "You're approved - here's your quote and appointment details",
    body: "Hi [Client First Name],\n\nYour tattoo request has been approved and your appointment has been scheduled. Here are the full details:\n\nProject Title: [auto-fill-title]\nLocation: [auto-fill-location]\nSession Date(s): [auto-fill-date]\nSession Rate: [auto-fill-session-rate]\nStart Time: [auto-fill-start-time]\nSession Length: [auto-fill-session-length]\nProject Notes: [auto-fill-notes]\nDeposit Required: [auto-fill-deposit-required]\n\nPlease pay your deposit using the below links:\n\n(insert clickable payment links here)\nDeposit policy: [auto-fill-deposit-policy]\n\nCancellation policy: [auto-fill-cancellation-policy]\n\nThanks so much - I'm looking forward to working with you.\n\n[Your Name]\n[Studio Name]",
}

const tempVariables = {
    "Client First Name": "Sam",
    "auto-fill-title": "Floral sleeve",
    "auto-fill-location": "Toronto, Canada",
    "auto-fill-date": "November 15, 2025",
    "auto-fill-session-rate": "$1000",
    "auto-fill-start-time": "10:00 AM",
    "auto-fill-session-length": "1 hour",
    "auto-fill-notes": "This is a test note",
    "auto-fill-deposit-required": "$500",
    "auto-fill-deposit-policy": "Deposit is required to secure your appointment. If you need to cancel, please do so within 24 hours to avoid losing your deposit.",
    "auto-fill-cancellation-policy": "If you need to cancel, please do so within 24 hours to avoid losing your deposit.",
    "Your Name": "Andrew Thomson",
    "Studio Name": "Simple Tattooer",
} as const;

const paymentLinks = {
    "Credit Card": "1111-1111-1111-1111",
    "Paypal": "https://simpletattooer.com/payment",
} as const;

const defaultAvatarUrl = "https://lkzdwcjvzyrhsieijjdr.supabase.co/storage/v1/object/public/assets/icons/dummy_photo.png";

const ManualBookingRequest = ({ variables = tempVariables, email_templates = emailTemplates, payment_links = paymentLinks, avatar_url = defaultAvatarUrl }: ManualBookingRequestProps) => {

    // Helper: render body template line-by-line and hide any line whose placeholder value is empty/missing.
    const resolveBodyWithHiddenEmptyLines = (
        template: string,
        vars: Record<string, string | readonly string[]>,
    ): string => {
        if (!template) return '';

        const placeholderRegex = /\[([^\]]+)\]/g;
        const lines = template.split('\n');
        const renderedLines: string[] = [];

        for (const line of lines) {
            let match: RegExpExecArray | null;
            let shouldHide = false;

            // Check all [key] placeholders in the line
            placeholderRegex.lastIndex = 0;
            while ((match = placeholderRegex.exec(line)) !== null) {
                const key = match[1];
                const value = getVariable(vars as Record<string, string | readonly string[]>, key, '');
                if (!value || value.trim().length === 0) {
                    // If any placeholder in this line resolves to an empty string,
                    // hide the entire line (e.g. "Deposit policy: [auto-fill-deposit-policy]").
                    shouldHide = true;
                    break;
                }
            }

            if (shouldHide) continue;

            // Render this line normally (replace placeholders, etc.)
            renderedLines.push(renderTemplate(line, vars));
        }

        return renderedLines.join('\n');
    };

    const resolvedSubject = renderTemplate(email_templates.subject, variables);
    const resolvedBody = resolveBodyWithHiddenEmptyLines(email_templates.body, variables);
    const previewFirstLine = resolvedBody.split('\n').find((l) => l.trim().length > 0);

    const artistName = getVariable(variables, 'Your Name', 'Simple Tattooer');
    const previewText = previewFirstLine ?? "Thanks for sending your idea my way!";
    const baseUrl = getBaseUrl();

    type Segment =
        | { type: 'text'; content: string }
        | { type: 'button'; label: string }
        | { type: 'payment_link' };

    const parseBodySegments = (text: string): Segment[] => {
        const segments: Segment[] = [];
        // Matches: (Button- Label) or (Buttons- label1|label2|...) or (insert clickable payment links here)
        const regex = /\((Button|Buttons)-\s*([^)]+)\)|\((?:insert clickable payment links here)\)/gi;
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            const idx = match.index;
            if (idx > lastIndex) {
                segments.push({ type: 'text', content: text.slice(lastIndex, idx) });
            }
            const kind = match[1];
            const payload = match[2];
            if (!kind) {
                // insert clickable payment links here
                segments.push({ type: 'payment_link' });
            } else if (/^Button$/i.test(kind)) {
                const label = (payload || '').trim();
                segments.push({ type: 'button', label });
            } else if (/^Buttons$/i.test(kind)) {
                const labels = (payload || '').split(/[|,]/).map((l) => l.trim()).filter(Boolean);
                if (labels.length === 0) {
                    segments.push({ type: 'payment_link' });
                } else {
                    for (const lbl of labels) {
                        segments.push({ type: 'button', label: lbl });
                    }
                }
            }
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            segments.push({ type: 'text', content: text.slice(lastIndex) });
        }
        return segments;
    };

    const segments = parseBodySegments(resolvedBody);

    const renderTextWithBreaks = (text: string) => {
        const parts: React.ReactNode[] = [];
        // Remove leading newlines
        const trimmedText = text.replace(/^\n+/, '');
        const lines = trimmedText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.length > 0) parts.push(line);
            if (i < lines.length - 1) parts.push(<br key={`br-${i}-${line.length}`} />);
        }
        return parts;
    };

    const resolveButtonHref = (label: string): string => {
        // Prefer variable value with label name, fallback to payment_links[label]
        const fromVar = getVariable(variables, label, '');
        if (fromVar) return fromVar;
        if (payment_links && payment_links[label]) return payment_links[label];
        return '#';
    };

    return (
        <Html style={{ colorScheme: 'light' }}>
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
                            * {
                                color: #FFFFFF !important;
                            }
                            [style*="background-color"] {
                                background-color: #05080F !important;
                            }
                            [style*="color"] {
                                color: inherit !important;
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
                                        alt={`${artistName}'s desktop`}
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
                                        <Text key={`t-${idx}`} className="text-white text-[16px] leading-[22px] my-0">
                                            {renderTextWithBreaks(content)}
                                        </Text>
                                    );
                                }
                                if (seg.type === 'payment_link') {
                                    return (
                                        <React.Fragment key={`pl-${idx}`}>
                                            {payment_links &&
                                                Object.entries(payment_links).map(([key, value]) => {
                                                    const isValueUrl = isUrl(value);
                                                    
                                                    if (isValueUrl) {
                                                        // For URLs, show a clickable button
                                                        return (
                                                            <React.Fragment key={`pl-btn-${key}`}>
                                                                <Button
                                                                    className="w-full text-[14px] font-normal no-underline text-center px-5"
                                                                    style={{ color: '#FFFFFF', height: '40px', lineHeight: '38px', display: 'block', maxWidth: '100%', boxSizing: 'border-box', borderRadius: '20px', border: '1px solid #94A3B8', marginBottom: '25px' }}
                                                                    href={value}
                                                                >
                                                                    {key}
                                                                </Button>
                                                            </React.Fragment>
                                                        );
                                                    } else {
                                                        // For non-URLs, show the label and value as text for manual copying
                                                        return (
                                                            <React.Fragment key={`pl-text-${key} `}>
                                                                <Button
                                                                    className="w-full text-[14px] font-normal no-underline text-center px-5"
                                                                    style={{ color: '#FFFFFF', height: '40px', lineHeight: '38px', display: 'block', maxWidth: '100%', boxSizing: 'border-box', borderRadius: '20px', border: '1px solid #94A3B8', marginBottom: '25px' }}
                                                                >
                                                                    {key}:  {value}
                                                                </Button>
                                                            </React.Fragment>
                                                        );
                                                    }
                                                })}
                                        </React.Fragment>
                                    );
                                }
                                if (seg.type === 'button') {
                                    const hrefValue = resolveButtonHref(seg.label);
                                    // If hrefValue is '#', use it directly; otherwise check if it's a URL
                                    const href = hrefValue === '#' 
                                        ? hrefValue
                                        : (isUrl(hrefValue) 
                                            ? hrefValue 
                                            : joinUrl(baseUrl, 'api/copy') + `?text=${encodeURIComponent(hrefValue)}`);
                                    
                                    return (
                                        <Button
                                            key={`b-${idx}`}
                                            className="w-full text-[14px] font-normal no-underline text-center px-5"
                                            style={{ color: '#FFFFFF', height: '40px', lineHeight: '38px', display: 'block', maxWidth: '100%', boxSizing: 'border-box', borderRadius: '20px', border: '1px solid #94A3B8', marginBottom: '25px' }}
                                            href={href}
                                        >
                                            {seg.label}
                                        </Button>
                                    );
                                }

                            })}
                        </Section>

                        {/* Footer */}
                        <Section className='mt-[28px] mx-auto max-w-[472px]' style={{ backgroundColor: '#05080F' }}>
                            <Row>
                                <Column className="mobile-block" style={{ verticalAlign: 'top' }}>
                                    <Text style={{ color: '#FFFFFF' }} className="text-[10px] leading-[14px] my-0 mb-2">Download Our App</Text>
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
                                    <Text style={{ color: '#FFFFFF' }} className="text-[10px] leading-[14px] my-0 mb-2">Follow Us</Text>
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
                            <Text style={{ color: '#FFFFFF' }} className="text-[12px] leading-[16px] my-0 mt-3">© 2025 Simple Tattooer. All Rights Reserved</Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default ManualBookingRequest;