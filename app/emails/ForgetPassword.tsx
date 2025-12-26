import {
    Body,
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

interface ForgetPasswordEmailProps {
    resetCode: string;
}

const ForgetPasswordEmail = ({ resetCode = '1234' }: ForgetPasswordEmailProps) => {
    const previewText = "Reset your Simple Tattooer password. Use the verification code below to complete the process.";

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
                    <Container className="mx-auto max-w-[600px] py-[40px] px-4" style={{ backgroundColor: '#05080F !important' }}>
                        <Section className="mx-auto max-w-[472px]" style={{ backgroundColor: '#05080F !important' }}>
                            <Img
                                src="https://rrjceacgpemebgmooeny.supabase.co/storage/v1/object/public/assets/icons/logo.png"
                                alt="Simple Tattooer"
                                width="64"
                                height="64"
                                className="mb-[10px] mx-auto"
                            />
                            <Heading style={{ color: '#F0F0F0 !important' }} className="text-[18px] font-normal text-center p-0 mx-0 my-0 uppercase">simple</Heading>
                            <Heading style={{ color: '#F0F0F0 !important' }} className="text-[18px] font-normal text-center p-0 mx-0 my-0 uppercase">tattooer</Heading>
                        </Section>

                        <Section className='mt-[28px] mx-auto max-w-[472px]' style={{ backgroundColor: '#05080F !important' }}>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[20px] my-0 mb-4">Hi,</Text>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[20px] my-0 mb-4">We received a request to reset your password for your Simple Tattooer account. Use the verification code below to complete the password reset process.</Text>
                            
                            {/* Verification Code Display */}
                            <Section className="my-6 text-center" style={{ backgroundColor: '#05080F !important', padding: '24px', borderRadius: '8px' }}>
                                <Text style={{ color: '#F0F0F0 !important' }} className="text-[14px] leading-[18px] my-0 mb-3 uppercase">Your Verification Code</Text>
                                <Text style={{ color: '#F0F0F0 !important', fontSize: '32px', fontWeight: 'bold', letterSpacing: '4px' }} className="text-center my-0 font-mono">
                                    {resetCode}
                                </Text>
                            </Section>

                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[20px] my-0 mb-4">Enter this code in the app to reset your password. This code will expire in 15 minutes for security reasons.</Text>
                            
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[20px] my-0 mb-4">
                                <strong>Important:</strong> If you didn&apos;t request a password reset, please ignore this email or contact our support team if you have concerns about your account security.
                            </Text>
                            
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[20px] my-0 mb-4">For your security, never share this code with anyone. Simple Tattooer will never ask for your verification code.</Text>
                            
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[20px] my-0 mt-4">Best regards,</Text>
                            <Text style={{ color: '#F0F0F0 !important' }} className="text-[16px] leading-[20px] my-0">The Simple Tattooer Team</Text>
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
};

export default ForgetPasswordEmail;