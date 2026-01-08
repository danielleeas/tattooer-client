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

interface ArtistRescheduleProps {
    artistName: string;
    clientName: string;
    reason: string;
    originalDate: string;
    originalTime: string;
    bookingLink: string;
    studioName: string;
    avatar_url: string;
}

const ArtistReschedule = ({ artistName, clientName, reason, originalDate, originalTime, bookingLink, studioName, avatar_url }: ArtistRescheduleProps) => {

    const previewText = "Thanks for sending your idea my way!";

    return (
        <Html>
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
                        <Section className="mx-auto max-w-[472px]">
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
                                    <Heading style={{ color: '#F0F0F0 !important' }} className="text-[24px] font-normal p-0 m-0 text-left mobile-center">Need to reschedule our appointment</Heading>
                                    <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[20px] my-0 mt-2 mobile-center">with {artistName}</Text>
                                </Column>
                                <Column className="mobile-hide" align="right" style={{ verticalAlign: 'middle' }}>
                                    <Img
                                        src={avatar_url}
                                        alt="Artist"
                                        width="100"
                                        height="100"
                                        style={{ borderRadius: '50px', objectFit: 'cover' }}
                                    />
                                </Column>
                            </Row>
                        </Section>

                        {/* Body copy */}
                        <Section className='mt-[28px] mx-auto max-w-[472px]'>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[22px] my-0 mb-4">Hi {clientName},</Text>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[22px] my-0 mb-4">I'm sorry, but I need to move our appointment on {originalDate} at {originalTime}.</Text>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[22px] my-0 mb-4">Reason: {reason}</Text>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[22px] my-0 mb-4">I've opened up my next available dates for you <Link href={bookingLink}>here</Link></Text>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[22px] my-0 mb-4">Please choose a new day that works for you, and see you soon.Thank you for understanding,</Text>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[22px] my-0">{artistName}</Text>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[22px] my-0">{studioName}</Text>
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

export default ArtistReschedule;