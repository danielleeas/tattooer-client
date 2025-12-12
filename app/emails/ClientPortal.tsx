import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Font,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface ClientPortalEmailProps {
    artistName: string;
    portalLink: string;
    avatar_url: string;
    clientName: string;
    studioName: string;
}

const ClientPortalEmail = ({
    artistName = 'Dainel Lee',
    portalLink = 'https://simpletattooer.com/client-portal',
    avatar_url = 'https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/icons/dummy_photo.png',
    clientName = 'Sam',
    studioName = 'Simple Tattooer'
}: ClientPortalEmailProps) => {
    const previewText = "Your Client Portal is ready! To get started, just click below:";

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
                        <Section className="mx-auto max-w-[472px]" style={{ backgroundColor: '#05080F' }}>
                            <Row>
                                <Column className="mobile-block desktop-hide mb-5" align="center">
                                    <Img
                                        src={avatar_url}
                                        alt={artistName}
                                        width="100"
                                        height="100"
                                        style={{ borderRadius: '50px' }}
                                    />
                                </Column>
                                <Column className="mobile-block" style={{ verticalAlign: 'middle' }}>
                                    <Heading style={{ color: '#FFFFFF' }} className="text-[24px] font-normal p-0 m-0 text-left mobile-center">Your Client Portal</Heading>
                                    <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mt-2 mobile-center">with {artistName}</Text>
                                </Column>
                                <Column className="mobile-hide" align="right" style={{ verticalAlign: 'middle' }}>
                                    <Img
                                        src={avatar_url}
                                        alt={artistName}
                                        width="100"
                                        height="100"
                                        style={{ borderRadius: '50px' }}
                                    />
                                </Column>
                            </Row>
                        </Section>

                        <Section className='mt-[28px] mx-auto max-w-[472px]' style={{ backgroundColor: '#05080F' }}>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mb-4">Hi {clientName}.</Text>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mb-4">I'm so excited to be working with you. As a perk of being my client, you now get access to your exclusive Client Portal — powered by Simple Tattooer.</Text>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mb-6">Inside your personal dashboard, you'll find your appointment details, payment info and receipts, my aftercare + FAQ pages, a reschedule/cancel button if anything changes, and a direct message portal to reach me anytime.</Text>

                            <Button
                                className="w-full text-[14px] font-normal no-underline text-center px-5"
                                href={portalLink}
                                style={{ color: '#FFFFFF', height: '40px', lineHeight: '38px', display: 'block', maxWidth: '100%', boxSizing: 'border-box', borderRadius: '20px', border: '1px solid #94A3B8', marginBottom: '25px' }}
                            >
                                Start Here
                            </Button>

                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0">This is your private space — built just for you.</Text>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mb-4">Can't wait to see you soon,</Text>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0">{artistName}</Text>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mb-4">{studioName}</Text>
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
};

export default ClientPortalEmail;