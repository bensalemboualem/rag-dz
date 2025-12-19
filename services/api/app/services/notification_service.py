"""
Notification Service - Automated Welcome Emails
================================================

PHASE 4: Expert Layer - Profile-Specific Onboarding

Sends personalized welcome emails based on user profile:
1. Geneva Psychologist (.ch): Security, confidentiality, time-saving
2. Algeria Education (.com): Innovation, bilingual support, knowledge capture

Features:
- Profile-specific templates (HTML + Text)
- Automatic redeem code generation (100 free tokens)
- 3-step Quick Start Guide
- Multi-language support

Created: 2025-12-16
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any
from datetime import datetime
import secrets
import string

from app.prompts import UserProfile, DomainContext, get_profile_metadata


class NotificationService:
    """
    Handles automated email notifications for user onboarding and engagement.
    """

    def __init__(
        self,
        smtp_host: str = None,
        smtp_port: int = None,
        smtp_user: str = None,
        smtp_password: str = None,
        from_email: str = None,
    ):
        """Initialize email service with SMTP configuration."""
        self.smtp_host = smtp_host or os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = smtp_port or int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = smtp_user or os.getenv("SMTP_USER", "")
        self.smtp_password = smtp_password or os.getenv("SMTP_PASSWORD", "")
        self.from_email = from_email or os.getenv("FROM_EMAIL", "noreply@iafactory.pro")

    def generate_welcome_code(self, prefix: str = "WELCOME") -> str:
        """
        Generate a secure welcome redeem code.

        Format: WELCOME-XXXX-XXXX-XXXX (100 free tokens)

        Args:
            prefix: Code prefix (default: WELCOME)

        Returns:
            Formatted redeem code
        """
        # Generate 3 groups of 4 random alphanumeric characters
        chars = string.ascii_uppercase + string.digits
        groups = [
            "".join(secrets.choice(chars) for _ in range(4))
            for _ in range(3)
        ]

        return f"{prefix}-{'-'.join(groups)}"

    def get_template_path(self, profile: UserProfile, format: str = "html") -> str:
        """
        Get the email template file path for a profile.

        Args:
            profile: User profile (PSYCHOLOGIST, EDUCATION, GENERAL)
            format: Template format (html or txt)

        Returns:
            Template file path
        """
        base_dir = os.path.dirname(os.path.dirname(__file__))
        templates_dir = os.path.join(base_dir, "templates", "emails")

        template_name = {
            UserProfile.PSYCHOLOGIST: f"psychologist_welcome.{format}",
            UserProfile.EDUCATION: f"education_welcome.{format}",
            UserProfile.GENERAL: f"geneva_welcome.{format}",
        }.get(profile, f"geneva_welcome.{format}")

        return os.path.join(templates_dir, template_name)

    def render_template(
        self,
        profile: UserProfile,
        format: str,
        variables: Dict[str, Any],
    ) -> str:
        """
        Render an email template with variables.

        Args:
            profile: User profile
            format: Template format (html or txt)
            variables: Template variables to substitute

        Returns:
            Rendered template string
        """
        template_path = self.get_template_path(profile, format)

        try:
            with open(template_path, "r", encoding="utf-8") as f:
                template = f.read()

            # Simple variable substitution
            for key, value in variables.items():
                placeholder = f"{{{{{key}}}}}"
                template = template.replace(placeholder, str(value))

            return template
        except FileNotFoundError:
            # Fallback to basic template if file not found
            return self._get_fallback_template(profile, format, variables)

    def _get_fallback_template(
        self,
        profile: UserProfile,
        format: str,
        variables: Dict[str, Any],
    ) -> str:
        """Fallback template if file not found."""
        if format == "html":
            return f"""
            <html>
            <body>
                <h1>Welcome to IA Factory</h1>
                <p>Your account is ready!</p>
                <p>Redeem Code: {variables.get('redeem_code', 'N/A')}</p>
            </body>
            </html>
            """
        else:
            return f"""
            Welcome to IA Factory

            Your account is ready!
            Redeem Code: {variables.get('redeem_code', 'N/A')}
            """

    def send_welcome_email(
        self,
        to_email: str,
        user_name: str,
        profile: UserProfile,
        domain_context: DomainContext,
        redeem_code: Optional[str] = None,
        tenant_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Send a profile-specific welcome email with free tokens.

        Args:
            to_email: Recipient email address
            user_name: User's name
            profile: User profile (determines template)
            domain_context: Domain context (SWITZERLAND, ALGERIA, GENEVA)
            redeem_code: Optional pre-generated redeem code
            tenant_id: Tenant ID for tracking

        Returns:
            Result dict with success status and details
        """
        # Generate redeem code if not provided
        if not redeem_code:
            redeem_code = self.generate_welcome_code()

        # Get profile metadata for branding
        metadata = get_profile_metadata(profile, domain_context)

        # Prepare template variables
        variables = {
            "user_name": user_name,
            "redeem_code": redeem_code,
            "token_amount": "100",
            "current_year": datetime.now().year,
            "tagline": metadata["tagline"],
            "focus": metadata["focus"],
            "flag": metadata["flag"],
            "support_email": "support@iafactory.pro",
            "dashboard_url": metadata.get("dashboard_url", "https://app.iafactory.pro"),
        }

        # Add profile-specific variables
        if profile == UserProfile.PSYCHOLOGIST:
            variables.update({
                "feature1": "Stress Detection",
                "feature2": "nLPD Compliance",
                "feature3": "Clinical Summaries",
                "privacy_note": "All patient data is encrypted and never stored with identifying information.",
            })
        elif profile == UserProfile.EDUCATION:
            variables.update({
                "feature1": "Personal Lexicon",
                "feature2": "Bilingual Summaries",
                "feature3": "Knowledge Extraction",
                "innovation_note": "Supporting the future of Algerian education with AI-powered tools.",
            })

        # Render HTML and text templates
        html_body = self.render_template(profile, "html", variables)
        text_body = self.render_template(profile, "txt", variables)

        # Get subject line based on profile
        subject = self._get_subject_line(profile, domain_context)

        # Send email
        try:
            result = self._send_email(
                to_email=to_email,
                subject=subject,
                html_body=html_body,
                text_body=text_body,
            )

            return {
                "success": True,
                "redeem_code": redeem_code,
                "sent_at": datetime.utcnow().isoformat(),
                "profile": profile.value,
                "to_email": to_email,
                **result,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "redeem_code": redeem_code,  # Still return code for manual delivery
                "profile": profile.value,
            }

    def _get_subject_line(
        self,
        profile: UserProfile,
        domain_context: DomainContext,
    ) -> str:
        """Get profile-specific email subject line."""
        subjects = {
            UserProfile.PSYCHOLOGIST: "Your Private AI Assistant is Ready | IA Factory Switzerland 🇨🇭",
            UserProfile.EDUCATION: "Welcome to the Future of Education | IA Factory Algeria 🇩🇿",
            UserProfile.GENERAL: "Your AI Assistant is Ready | IA Factory Geneva 🌍",
        }
        return subjects.get(profile, subjects[UserProfile.GENERAL])

    def _send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: str,
    ) -> Dict[str, Any]:
        """
        Send an email via SMTP.

        Args:
            to_email: Recipient email
            subject: Email subject
            html_body: HTML content
            text_body: Plain text content

        Returns:
            Result dict with status
        """
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.from_email
        msg["To"] = to_email

        # Attach both plain text and HTML versions
        part1 = MIMEText(text_body, "plain", "utf-8")
        part2 = MIMEText(html_body, "html", "utf-8")
        msg.attach(part1)
        msg.attach(part2)

        # Send via SMTP
        if not self.smtp_user or not self.smtp_password:
            # No SMTP configured - log only mode
            print(f"[EMAIL] Would send to {to_email}: {subject}")
            print(f"[EMAIL] Redeem code in body")
            return {"status": "logged", "message": "SMTP not configured - email logged only"}

        with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
            server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            server.send_message(msg)

        return {"status": "sent", "message": "Email sent successfully"}

    def send_token_low_reminder(
        self,
        to_email: str,
        user_name: str,
        current_balance: int,
        profile: UserProfile,
    ) -> Dict[str, Any]:
        """
        Send a reminder when tokens are running low.

        Args:
            to_email: User email
            user_name: User name
            current_balance: Current token balance
            profile: User profile

        Returns:
            Result dict
        """
        subject = f"⚠️ Token Balance Low | IA Factory"

        # Simple template for now
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Token Balance Low</h2>
            <p>Hi {user_name},</p>
            <p>Your token balance is running low: <strong>{current_balance} tokens remaining</strong></p>
            <p>To continue using IA Factory without interruption, please recharge your account.</p>
            <p>
                <a href="https://app.iafactory.pro/tokens/recharge"
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                          color: white; padding: 12px 24px; text-decoration: none;
                          border-radius: 8px; display: inline-block;">
                    Recharge Tokens
                </a>
            </p>
            <p>Thank you for using IA Factory!</p>
        </body>
        </html>
        """

        text_body = f"""
        Token Balance Low

        Hi {user_name},

        Your token balance is running low: {current_balance} tokens remaining

        To continue using IA Factory without interruption, please recharge your account.

        Visit: https://app.iafactory.pro/tokens/recharge

        Thank you for using IA Factory!
        """

        try:
            result = self._send_email(to_email, subject, html_body, text_body)
            return {"success": True, **result}
        except Exception as e:
            return {"success": False, "error": str(e)}


# Singleton instance
_notification_service: Optional[NotificationService] = None


def get_notification_service() -> NotificationService:
    """Get or create the notification service singleton."""
    global _notification_service
    if _notification_service is None:
        _notification_service = NotificationService()
    return _notification_service
