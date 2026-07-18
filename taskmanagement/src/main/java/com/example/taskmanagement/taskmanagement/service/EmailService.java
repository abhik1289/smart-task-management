package com.example.taskmanagement.taskmanagement.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final Resend resend;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Async
    public void sendActivationEmail(String toEmail, String userName, int activationCode) {
        String subject = "Activate your account";
        String htmlContent = buildActivationEmailHtml(userName, activationCode);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(toEmail)
                .subject(subject)
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(params);
            log.info("Activation email sent to {} with id: {}", toEmail, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send activation email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    private String buildActivationEmailHtml(String userName, int activationCode) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Activate your account</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; text-align: center;">Welcome, %s!</h2>
                    <p style="color: #555; font-size: 16px;">Thank you for signing up. Please use the activation code below to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2c7be5; background: #f0f6ff; padding: 15px 30px; border-radius: 6px;">
                            %06d
                        </span>
                    </div>
                    <p style="color: #555; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">If you did not create an account, please ignore this email.</p>
                </div>
            </body>
            </html>
            """.formatted(userName, activationCode);
    }
}
