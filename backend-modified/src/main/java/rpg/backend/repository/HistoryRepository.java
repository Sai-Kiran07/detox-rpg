package rpg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.model.HistoryEntry;

public interface HistoryRepository extends JpaRepository<HistoryEntry, String> {
}