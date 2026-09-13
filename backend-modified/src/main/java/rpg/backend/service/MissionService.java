package rpg.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import rpg.backend.dto.UserRepository;
import rpg.backend.model.Mission;
import rpg.backend.model.Profile;
import rpg.backend.model.Subtask;
import rpg.backend.model.User;
import rpg.backend.repository.MissionRepository;
import rpg.backend.repository.ProfileRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MissionService {

    @Autowired
    UserRepository userRepository;

    private final MissionRepository missionRepository;
    private final ProfileRepository profileRepository;

    public List<Mission> getMissions() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return missionRepository.findByUser(user);
    }

    public Mission createMission(Mission mission) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        mission.setUser(user);

        if (mission.getCompleted() == null) {
            mission.setCompleted(false);
        }

        return missionRepository.save(mission);
    }

    public Mission updateMission(String id, Mission mission) {
        Mission existing = getMission(id);

        existing.setTitle(mission.getTitle());
        existing.setDescription(mission.getDescription());
        existing.setCategory(mission.getCategory());
        existing.setStage(mission.getStage());
        existing.setPriority(mission.getPriority());
        existing.setRecurrence(mission.getRecurrence());
        existing.setAttribute(mission.getAttribute());
        existing.setAttributeGain(mission.getAttributeGain());
        existing.setRewardXp(mission.getRewardXp());
        existing.setRewardScore(mission.getRewardScore());
        existing.setRewardTickets(mission.getRewardTickets());
        existing.setDeadline(mission.getDeadline());
        existing.setSubtasks(mission.getSubtasks());

        if (mission.getCompleted() != null) {
            existing.setCompleted(mission.getCompleted());
        }

        return missionRepository.save(existing);
    }

    public void deleteMission(String id) {
        missionRepository.deleteById(id);
    }

    public Map<String, Object> completeMission(
            String id,
            Map<String, Integer> rewards
    ) {
        Mission mission = getMission(id);

        Profile profile = profileRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        int xp = rewards.getOrDefault("xpEarned", mission.getRewardXp());
        int score = rewards.getOrDefault("scoreEarned", mission.getRewardScore());
        int tickets = rewards.getOrDefault("ticketsEarned", mission.getRewardTickets());

        mission.setCompleted(true);
        missionRepository.save(mission);

        profile.setXp(profile.getXp() + xp);
        profile.setScore(profile.getScore() + score);
        profile.setTickets(profile.getTickets() + tickets);

        profileRepository.save(profile);

        Map<String, Object> historyEntry = new HashMap<>();
        historyEntry.put("missionId", mission.getId());
        historyEntry.put("xpEarned", xp);
        historyEntry.put("scoreEarned", score);
        historyEntry.put("ticketsEarned", tickets);

        Map<String, Object> response = new HashMap<>();
        response.put("mission", mission);
        response.put("profile", profile);
        response.put("historyEntry", historyEntry);

        return response;
    }

    public Mission uncompleteMission(String id) {
        Mission mission = getMission(id);
        mission.setCompleted(false);
        return missionRepository.save(mission);
    }

    public Mission toggleSubtask(String id, String subtaskId) {
        Mission mission = getMission(id);

        for (Subtask subtask : mission.getSubtasks()) {
            if (subtask.getId().equals(subtaskId)) {
                subtask.setCompleted(!subtask.isCompleted());
                break;
            }
        }

        return missionRepository.save(mission);
    }

    private Mission getMission(String id) {
        return missionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mission not found"));
    }
}