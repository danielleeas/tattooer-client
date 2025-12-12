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

interface WelcomeEmailProps {
    artistName: string;
    bookingLink: string;
    qrCodeUrl: string;
}

const WelcomeEmail = ({ artistName = 'Dainel Lee', bookingLink = 'https://simpletattooer.com/booking', qrCodeUrl = 'https://simpletattooer.com/qr-code' }: WelcomeEmailProps) => {
    const previewText = "Welcome to Simple Tattooer! Your account is set up. To get started, just click below:";

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
                            <Img
                                src="https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/icons/logo.png"
                                alt="Simple Tattooer"
                                width="64"
                                height="64"
                                className="mb-[10px] mx-auto"
                            />
                            <Heading style={{ color: '#FFFFFF' }} className="text-[18px] font-normal text-center p-0 mx-0 my-0 uppercase">simple</Heading>
                            <Heading style={{ color: '#FFFFFF' }} className="text-[18px] font-normal text-center p-0 mx-0 my-0 uppercase">tattooer</Heading>
                        </Section>

                        <Section className='mt-[28px] mx-auto max-w-[472px]' style={{ backgroundColor: '#05080F' }}>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mb-4">Hi {artistName}, weclome to Simple Tattooer!</Text>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mb-4">Your subscription is active, and your account is set up!</Text>
                            <Text style={{ color: '#FFFFFF' }} className="text-[16px] leading-[20px] my-0 mb-0">Your Personal Booking Link and matching QR code are below(this can be edited anytime in Your Settings in the app):</Text>
                            <Text style={{ color: '#058CFA' }} className="text-[16px] leading-[20px] my-0 mb-1">{bookingLink}</Text>
                            <Img
                                src={qrCodeUrl}
                                alt="Qr Code"
                                width="160"
                                height="160"
                                className="mb-4"
                            />
                            <Text style={{ color: '#FFFFFF!important' }} className="text-[16px] leading-[20px] my-0 mb-4">Share it on Instagram, your website, or anywhere else so clients can fill out your booking form, make a consultation appointment, and more.</Text>
                            <Text style={{ color: '#FFFFFF!important' }} className="text-[16px] leading-[20px] my-0 mb-4">Need help with the app? We&apos;ve made short walkthrough videos for every feature:</Text>
                            <Link href="https://drive.google.com/drive/folders/1NjBjLlfPaEQS1ZBKriYwuaU7k66UcA_6" style={{ color: '#058CFA!important' }} className="text-[16px] leading-[20px] my-0">Watch the Demo Videos</Link>
                            <Text style={{ color: '#FFFFFF!important' }} className="text-[16px] leading-[20px] my-0 mt-4">Thanks for being here —</Text>
                            <Text style={{ color: '#FFFFFF!important' }} className="text-[16px] leading-[20px] my-0">The Simple Tattooer Team</Text>
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

export default WelcomeEmail;