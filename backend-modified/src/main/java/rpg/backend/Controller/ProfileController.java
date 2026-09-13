package rpg.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rpg.backend.model.Profile;
import rpg.backend.service.ProfileService;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin ("*")

public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public Profile getProfile() {
        return profileService.getProfile();
    }

    @PatchMapping
    public Profile updateProfile(@RequestBody Profile profile) {
        return profileService.updateProfile(profile);
    }

    @PostMapping("/check-in")
    public Profile checkIn() {
        return profileService.checkIn();
    }

    @PostMapping("/allocate-skill")
    public Profile allocateSkill(@RequestBody Map<String, String> request) {
        return profileService.allocateSkill(request.get("attribute"));
    }}