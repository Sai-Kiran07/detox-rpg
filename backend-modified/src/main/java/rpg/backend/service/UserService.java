package rpg.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import rpg.backend.dto.UserRepository;
import rpg.backend.model.Profile;
import rpg.backend.model.User;
import rpg.backend.repository.ProfileRepository;

@Service
public class UserService {

    @Autowired
    UserRepository repo;

    @Autowired
    ProfileRepository profileRepository;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User saveUser(User user) {

        user.setPassword(encoder.encode(user.getPassword()));

        user = repo.save(user);

        Profile profile = new Profile();

        profile.setName(user.getUsername());
        profile.setCallsign("PLAYER");
        profile.setLevel(1);
        profile.setXp(0);
        profile.setScore(0);
        profile.setTickets(0);
        profile.setUnspentSkillPoints(0);

        profile.setHp(100);
        profile.setMaxHp(100);
        profile.setEnergy(100);
        profile.setMaxEnergy(100);

        profile.setStreak(0);
        profile.setStreakShields(0);
        profile.setAvatar("🕹️");

        profile.setUser(user);

        profileRepository.save(profile);

        return user;
    }
}