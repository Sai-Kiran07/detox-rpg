package rpg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.model.Mission;

public interface MissionRepository extends JpaRepository<Mission, String> {
}