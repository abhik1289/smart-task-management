package com.example.taskmanagement.taskmanagement.security;

import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.exception.BadException;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Resolves the {@link CurrentUser} annotation by extracting the {@link User}
 * from the current Spring Security {@link Authentication}. This avoids unsafe
 * casts and anonymous-principal bugs inside controllers.
 */
@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && User.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BadException("Authentication required");
        }
        Object principal = auth.getPrincipal();
        if (!(principal instanceof User user)) {
            throw new BadException("Invalid principal");
        }
        return user;
    }
}