package com.example.taskmanagement.taskmanagement.controller;


import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.taskmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/admin")
    public List<User> findAll(){
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable Long id){
        Long refineId = Long.parseLong(id.toString());
        return userService.findById(refineId);
    }

//    @GetMapping("/me")
//    public User findMe(Authentication authentication){
//        User user = (User) authentication.getPrincipal();
//        String refineId =  authentication.getDetails().toString();
//        log.debug("refineId:{}",refineId);
//    }



}
