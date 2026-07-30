export function verificationEmailTemplate(url: string) {
  return `
    <h2>Welcome to Klyro 👋</h2>

    <p>Please verify your email by clicking the button below.</p>

    <a href="${url}">
      Verify Email
    </a>

    <p>This link expires in 30 minutes.</p>
  `;
}