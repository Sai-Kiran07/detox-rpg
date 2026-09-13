package rpg.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rpg.backend.model.Mission;
import rpg.backend.service.MissionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/missions")
@RequiredArgsConstructor
@CrossOrigin ("*")

public class MissionController {

    private final MissionService missionService;

    @GetMapping
    public List<Mission> getMissions() {
        return missionService.getMissions();
    }

    @PostMapping
    public Mission createMission(@RequestBody Mission mission) {
        return missionService.createMission(mission);
    }

    @PutMapping("/{id}")
    public Mission updateMission(
            @PathVariable String id,
            @RequestBody Mission mission
    ) {
        return missionService.updateMission(id, mission);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deleteMission(@PathVariable String id) {
        missionService.deleteMission(id);
        return Map.of("success", true);
    }

    @PostMapping("/{id}/complete")
    public Map<String, Object> completeMission(
            @PathVariable String id,
            @RequestBody Map<String, Integer> rewards
    ) {
        return missionService.completeMission(id, rewards);
    }

    @PostMapping("/{id}/uncomplete")
    public Mission uncompleteMission(@PathVariable String id) {
        return missionService.uncompleteMission(id);
    }

    @PostMapping("/{id}/subtasks/{subtaskId}/toggle")
    public Mission toggleSubtask(
            @PathVariable String id,
            @PathVariable String subtaskId
    ) {
        return missionService.toggleSubtask(id, subtaskId);
    }
}