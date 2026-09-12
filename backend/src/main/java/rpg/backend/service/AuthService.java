package rpg.backend.service;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rpg.backend.dto.LoginRequestDto;
import rpg.backend.dto.LoginResponseDto;
import rpg.backend.dto.SignupRequestDto;
import rpg.backend.dto.SignupResponseDto;
import rpg.backend.entity.User;
import rpg.backend.repository.UserRepository;
import rpg.backend.security.AuthUtil;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
      Authentication authentication = authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword())
      );
      User user = (User) authentication.getPrincipal();
      String token = authUtil.generateAccessKey(user);
      return new LoginResponseDto(token, user.getId());
    }

    public SignupResponseDto signup(SignupRequestDto signupRequestDto) {
        if(userRepository.findByUsername(signupRequestDto.getUsername()).isPresent()){
            throw new IllegalArgumentException("User already exists");
        }
        User user = userRepository.save(User.builder()
                .username(signupRequestDto.getUsername())
                .password(passwordEncoder.encode(signupRequestDto.getPassword()))
                .build()
        );
        return new SignupResponseDto(user.getId(), user.getUsername());
    }
}
