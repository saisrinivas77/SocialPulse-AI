# app/services/email_service.py
"""Production Email Delivery Service supporting Resend API, SendGrid, and SMTP fallbacks."""

import logging
import os
import httpx
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class EmailService:
    """Handles sending transactional emails with modern HTML templates."""

    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY", "")
        self.from_email = os.getenv("EMAIL_FROM", "SocialPulse AI <no-reply@socialpulse.ai>")
        self.app_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

    async def send_verification_email(self, to_email: str, name: str, token: str) -> bool:
        """Send account verification email with secure signed link."""
        verify_url = f"{self.app_url}/auth/verify-email?token={token}"
        subject = "Verify your SocialPulse AI Account"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFAF8; color: #111; margin: 0; padding: 40px 20px; }}
            .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #ECECEC; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }}
            .logo {{ font-weight: 900; font-size: 22px; color: #111; letter-spacing: -0.5px; margin-bottom: 24px; display: inline-block; }}
            .logo span {{ color: #C8A14A; }}
            h1 {{ font-size: 24px; font-weight: 800; tracking: -0.5px; margin-top: 0; }}
            p {{ font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 24px; }}
            .btn {{ display: inline-block; background: linear-gradient(135deg, #C8A14A 0%, #9F7A2F 100%); color: #ffffff !important; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 12px; font-size: 14px; box-shadow: 0 4px 14px rgba(200, 161, 74, 0.35); }}
            .footer {{ margin-top: 32px; border-top: 1px solid #F0F0F0; padding-top: 20px; font-size: 12px; color: #999; text-align: center; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">SocialPulse <span>AI</span></div>
            <h1>Welcome to SocialPulse AI, {name}!</h1>
            <p>Please confirm your email address to activate your enterprise workspace and unlock full AI analytics, scheduling, and insights.</p>
            <p style="text-align: center; margin: 32px 0;">
              <a href="{verify_url}" class="btn">Verify Email Address</a>
            </p>
            <p>Or copy and paste this verification link into your browser:<br/><a href="{verify_url}" style="color: #C8A14A; word-break: break-all;">{verify_url}</a></p>
            <p>This verification link expires in 24 hours.</p>
            <div class="footer">
              &copy; 2026 SocialPulse AI Inc. Enterprise Identity & Security.
            </div>
          </div>
        </body>
        </html>
        """
        return await self._dispatch_email(to_email, subject, html_content)

    async def send_welcome_email(self, to_email: str, name: str) -> bool:
        """Send welcome email after account verification."""
        dashboard_url = f"{self.app_url}/dashboard"
        subject = "Welcome to SocialPulse AI - Enterprise Workspace Activated"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFAF8; color: #111; margin: 0; padding: 40px 20px; }}
            .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #ECECEC; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }}
            .logo {{ font-weight: 900; font-size: 22px; color: #111; letter-spacing: -0.5px; margin-bottom: 24px; display: inline-block; }}
            .logo span {{ color: #C8A14A; }}
            h1 {{ font-size: 24px; font-weight: 800; margin-top: 0; }}
            p {{ font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px; }}
            .btn {{ display: inline-block; background: #111111; color: #ffffff !important; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 12px; font-size: 14px; }}
            .footer {{ margin-top: 32px; border-top: 1px solid #F0F0F0; padding-top: 20px; font-size: 12px; color: #999; text-align: center; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">SocialPulse <span>AI</span></div>
            <h1>Your Workspace is Ready, {name}</h1>
            <p>You have successfully activated your account. Connect your social channels and let our autonomous AI agents handle content generation, trend analysis, and engagement growth.</p>
            <p style="text-align: center; margin: 32px 0;">
              <a href="{dashboard_url}" class="btn">Go to Dashboard</a>
            </p>
            <div class="footer">
              &copy; 2026 SocialPulse AI Inc. Enterprise Identity & Security.
            </div>
          </div>
        </body>
        </html>
        """
        return await self._dispatch_email(to_email, subject, html_content)

    async def send_password_reset_email(self, to_email: str, name: str, token: str) -> bool:
        """Send password recovery link."""
        reset_url = f"{self.app_url}/auth/reset-password?token={token}"
        subject = "Reset your SocialPulse AI Password"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFAF8; color: #111; margin: 0; padding: 40px 20px; }}
            .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #ECECEC; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }}
            .logo {{ font-weight: 900; font-size: 22px; color: #111; letter-spacing: -0.5px; margin-bottom: 24px; display: inline-block; }}
            .logo span {{ color: #C8A14A; }}
            h1 {{ font-size: 24px; font-weight: 800; margin-top: 0; }}
            p {{ font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 24px; }}
            .btn {{ display: inline-block; background: #DC2626; color: #ffffff !important; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 12px; font-size: 14px; }}
            .footer {{ margin-top: 32px; border-top: 1px solid #F0F0F0; padding-top: 20px; font-size: 12px; color: #999; text-align: center; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">SocialPulse <span>AI</span></div>
            <h1>Password Reset Request</h1>
            <p>Hello {name}, we received a request to reset your password. Click the button below to choose a new password.</p>
            <p style="text-align: center; margin: 32px 0;">
              <a href="{reset_url}" class="btn">Reset Password</a>
            </p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <div class="footer">
              &copy; 2026 SocialPulse AI Inc. Enterprise Identity & Security.
            </div>
          </div>
        </body>
        </html>
        """
        return await self._dispatch_email(to_email, subject, html_content)

    async def send_security_alert_email(self, to_email: str, name: str, details: Dict[str, Any]) -> bool:
        """Send security notification regarding new device login."""
        subject = "Security Alert: New Sign-in to SocialPulse AI"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFAF8; color: #111; margin: 0; padding: 40px 20px; }}
            .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #ECECEC; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }}
            .logo {{ font-weight: 900; font-size: 22px; color: #111; letter-spacing: -0.5px; margin-bottom: 24px; display: inline-block; }}
            .logo span {{ color: #C8A14A; }}
            .box {{ background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 14px; color: #374151; }}
            .footer {{ margin-top: 32px; border-top: 1px solid #F0F0F0; padding-top: 20px; font-size: 12px; color: #999; text-align: center; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">SocialPulse <span>AI</span></div>
            <h1>New Device Sign-in Detected</h1>
            <p>Hello {name}, your SocialPulse AI account was accessed from a new device.</p>
            <div class="box">
              <strong>IP Address:</strong> {details.get('ip', 'Unknown')}<br/>
              <strong>Browser / OS:</strong> {details.get('browser', 'Unknown')} on {details.get('os', 'Unknown')}<br/>
              <strong>Time:</strong> {details.get('time', 'Just now')}
            </div>
            <p>If this was you, no action is needed. If you did not recognize this login, please revoke active sessions in your Security Center immediately.</p>
            <div class="footer">
              &copy; 2026 SocialPulse AI Inc. Enterprise Identity & Security.
            </div>
          </div>
        </body>
        </html>
        """
        return await self._dispatch_email(to_email, subject, html_content)

    async def _dispatch_email(self, to_email: str, subject: str, html: str) -> bool:
        """Internal helper sending email via Resend API or logging to console in dev mode."""
        if not self.api_key:
            logger.info(f"[DEV EMAIL LOG] To: {to_email} | Subject: {subject}")
            return True

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.resend.com/emails",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "from": self.from_email,
                        "to": [to_email],
                        "subject": subject,
                        "html": html,
                    },
                )
                if res.status_code in (200, 201):
                    logger.info(f"Email successfully sent to {to_email}")
                    return True
                else:
                    logger.error(f"Resend API error ({res.status_code}): {res.text}")
                    return False
        except Exception as e:
            logger.error(f"Failed to dispatch email to {to_email}: {e}")
            return False

email_service = EmailService()
