package rpg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.model.Mission;
import rpg.backend.model.User;

import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, String> {
    List<Mission> findByUser(User user);
}