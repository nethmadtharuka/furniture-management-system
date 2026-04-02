package com.suhada.furniture.service;

import com.suhada.furniture.entity.Order;

public interface EmailService {

    // Send welcome email
    void sendWelcomeEmail(String toEmail, String fullName);

    // Send order confirmation email
    void sendOrderConfirmationEmail(Order order);

    // Send order status update email
    void sendOrderStatusUpdateEmail(Order order, String oldStatus, String newStatus);

    // Generic email sending
    void sendEmail(String to, String subject, String body);
}