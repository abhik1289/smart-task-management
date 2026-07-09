package com.example.taskmanagement.taskmanagement.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Resolves the currently authenticated
 * {@link com.example.taskmanagement.taskmanagement.entity.User}
 * from the {@link org.springframework.security.core.Authentication} principal
 * and injects it
 * into controller method parameters.
 *
 * <p>
 * Usage:
 * 
 * <pre>
 * {@code
 * &#64;PostMapping("/")
 * public ResponseEntity<?> create(@Valid @RequestBody FooRequest req,
 *                                 @CurrentUser User user) {
 *     ...
 * }
 * }
 * </pre>
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUser {
}