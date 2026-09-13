package rpg.backend.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rpg.backend.model.User;
import rpg.backend.service.JwtService;
import rpg.backend.service.UserService;

import java.util.Map;

@RestController
@CrossOrigin("*")
public class UserController {

    @Autowired
    UserService service;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtService jwtService;

    @PostMapping("/api/auth/register")
    public User saveUser(@RequestBody User user) {
        System.out.println(user);
        return service.saveUser(user);
    }

    @GetMapping("/me")
    public String currentUser() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return auth.getName();
    }

    @PostMapping("/api/auth/login")
    public Object login(@RequestBody User user) {

        Authentication auth = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(
                        user.getUsername(), user.getPassword()
                ));


        if (auth.isAuthenticated()) {
            String token = jwtService.generateToken(user.getUsername());

            return ResponseEntity.ok(
                    Map.of("token", token)
            );


        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

}
