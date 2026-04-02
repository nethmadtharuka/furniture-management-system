package com.suhada.furniture.service.impl;

import com.suhada.furniture.entity.Order;
import com.suhada.furniture.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendWelcomeEmail(String toEmail, String fullName) {
        log.info("📧 Welcome email would be sent to: {} (Email service not fully configured)", toEmail);
        // TODO: Implement when email configuration is ready
    }

    @Override
    public void sendOrderConfirmationEmail(Order order) {
        log.info("📧 Order confirmation email would be sent for order: {}", order.getOrderNumber());
        // TODO: Implement when email configuration is ready
    }

    @Override
    public void sendOrderStatusUpdateEmail(Order order, String oldStatus, String newStatus) {
        log.info("📧 Status update email would be sent for order: {} ({} -> {})",
                order.getOrderNumber(), oldStatus, newStatus);
        // TODO: Implement when email configuration is ready
    }

    @Override
    public void sendEmail(String to, String subject, String body) {
        log.info("📧 Email would be sent to: {} with subject: {}", to, subject);
        // TODO: Implement when email configuration is ready
    }
}