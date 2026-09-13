package rpg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.model.Prize;

public interface PrizeRepository extends JpaRepository<Prize, String> {
}