package com.example.taskmanagement.taskmanagement.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {


    public static final String QUEUE = "notification.queue";

    @Bean
    Queue queue() {
        return new Queue(QUEUE, true);
    }

    /** Send notification objects as JSON instead of Java binary objects. */
    @Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

}
