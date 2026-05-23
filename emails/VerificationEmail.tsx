import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface VerificationEmailProps {
  name: string
  verificationUrl: string
}

export default function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for SecureGate</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>SecureGate</Heading>
          <Text style={greeting}>Hi {name},</Text>
          <Text style={paragraph}>
            Thanks for creating an account. Please verify your email address by clicking the button below.
          </Text>
          <Section style={buttonContainer}>
            <Button href={verificationUrl} style={button}>
              Verify Email
            </Button>
          </Section>
          <Text style={paragraph}>
            If you did not create this account, you can safely ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This link expires in 15 minutes. If it has expired, you can request a new verification link.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f9fafb",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: "40px 0",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "480px",
  padding: "40px 32px",
}

const heading = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#111827",
  textAlign: "center" as const,
  margin: "0 0 24px",
}

const greeting = {
  fontSize: "16px",
  color: "#374151",
  margin: "0 0 16px",
}

const paragraph = {
  fontSize: "15px",
  color: "#4b5563",
  lineHeight: "24px",
  margin: "0 0 16px",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0 16px",
}

const footer = {
  fontSize: "13px",
  color: "#9ca3af",
  margin: "0",
}
