package rpg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.model.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
