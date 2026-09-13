package rpg.backend.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rpg.backend.model.User;
import rpg.backend.service.JwtService;
import rpg.backend.service.UserService;

@RestController
public class UserController {

    @Autowired
    UserService service;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtService jwtService;

    @PostMapping("/register")
    public User saveUser(@RequestBody User user){
        return service.saveUser(user);
    }

    @GetMapping("/me")
    public String currentUser(){
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return auth.getName();
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){

        Authentication auth = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(
                        user.getUsername(),user.getPassword()
                ));


        if(auth.isAuthenticated()){
            return jwtService.generateToken(user.getUsername());
        }
        return "Failed";
    }


    @GetMapping("/profile/{username}")
    @PreAuthorize(       //alowed for any admin role or with same username
            "hasAuthority('ROLE_ADMIN') || #username == authentication.name"
    )

    /**Check permission
     ↓
     If allowed → run method */
    public String getProfile(
            @PathVariable String username) {

        return "profile";
    }



    /**execute the method but return only if authorised */
//    @PostAuthorize(
//            "returnObject.username == authentication.name"
//    )
//    public User getUser(Long id) {
//
//        return repo.findById(id).get();
//    }
}
