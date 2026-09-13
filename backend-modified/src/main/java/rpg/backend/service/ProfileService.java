package rpg.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import rpg.backend.model.Profile;
import rpg.backend.repository.ProfileRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Profile getProfile() {
        return profileRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public Profile updateProfile(Profile profile) {
        Profile existing = getProfile();

        existing.setName(profile.getName());
        existing.setCallsign(profile.getCallsign());
        existing.setAvatar(profile.getAvatar());

        return profileRepository.save(existing);
    }

    public Profile checkIn() {
        Profile profile = getProfile();

        String today = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("EEE MMM dd yyyy", Locale.ENGLISH));

        if (today.equals(profile.getLastCheckInDate())) {
            return profile;
        }

        profile.setLastCheckInDate(today);
        profile.setStreak(profile.getStreak() + 1);
        profile.setTickets(profile.getTickets() + 10);
        profile.setXp(profile.getXp() + 20);

        return profileRepository.save(profile);
    }

    public Profile allocateSkill(String attribute) {
        Profile profile = getProfile();

        if (profile.getUnspentSkillPoints() <= 0) {
            return profileRepository.save(profile);
        }

        switch (attribute.toUpperCase()) {
            case "INT":
                profile.getAttributes().setIntelligence(
                        profile.getAttributes().getIntelligence() + 1
                );
                break;

            case "STR":
                profile.getAttributes().setStrength(
                        profile.getAttributes().getStrength() + 1
                );
                break;

            case "AGI":
                profile.getAttributes().setAgility(
                        profile.getAttributes().getAgility() + 1
                );
                break;

            case "END":
                profile.getAttributes().setEndurance(
                        profile.getAttributes().getEndurance() + 1
                );
                break;

            case "CHA":
                profile.getAttributes().setCharisma(
                        profile.getAttributes().getCharisma() + 1
                );
                break;

            default:
                System.out.println("ATTRIBUTE = [" + attribute + "]");
                throw new RuntimeException("Invalid attribute: " + attribute);
        }

        profile.setUnspentSkillPoints(
                profile.getUnspentSkillPoints() - 1
        );

        return profileRepository.save(profile);
    }
}