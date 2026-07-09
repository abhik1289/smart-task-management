package com.example.taskmanagement.taskmanagement.service;


import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;


    public List<User> findAll(){
        return userRepository.findAll();
    }

    public User findById(Long id){
        return userRepository.findById(id).orElseThrow();
    }

    public User findByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow();
    }




}
